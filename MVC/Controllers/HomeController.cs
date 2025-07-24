using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;
using MVC.Models;
using System.Diagnostics;
using System.Globalization;
using static NuGet.Packaging.PackagingConstants;

namespace MVC.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private static readonly string[] FullHeaders = new[]
        {
            "Locales_Id",
            "PageName",
            "PageFriendlyName",
            "LabelName",
            "LabelFriendlyName",
            "Text",
            "DateCreated",
            "DateModified",
            "Note",
            "IsHTML",
            "CMS_WidgetName",
            "CMS_Category",
            "CMS_IsHidden",
            "CMS_PreviewURL"
        };

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index() => View();
        public IActionResult ListGen() => View();
        public IActionResult Table() => View();
        public IActionResult Game() => View();
        public IActionResult Datatables() => View();

        [HttpGet]
        public IActionResult RetrieveCSV()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(),
                                    "wwwroot", "CSV", "data.csv");
            if (!System.IO.File.Exists(path))
                return NotFound("CSV file not found.");

            using var reader = new StreamReader(path);
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                MissingFieldFound = null,
                HeaderValidated = null,
                BadDataFound = null,
            };
            using var csv = new CsvReader(reader, config);
            csv.Context.RegisterClassMap<CsvRecordMap>();
            var records = csv.GetRecords<CsvRecord>().ToList();
            return Json(records);
        }

        [HttpPost]
        public IActionResult AddNewRecord([FromBody] CsvRecord newRec)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "CSV");
                Directory.CreateDirectory(folder);
                var filePath = Path.Combine(folder, "data.csv");
                var exists = System.IO.File.Exists(filePath);

                using var writer = new StreamWriter(filePath, append: true);
                if (!exists)
                {
                    writer.WriteLine(string.Join(",", FullHeaders));
                }

                var allValues = new object[]
                {
                    newRec.Locales_Id,
                    "",
                    newRec.PageFriendlyName,
                    "",
                    newRec.LabelFriendlyName,
                    newRec.Text,
                    DateTime.UtcNow,
                    "", "", false, "", "", false, ""
                };

              
                var quoted = allValues
                    .Select(v => $"\"{v?.ToString().Replace("\"", "\"\"")}\"");
                writer.WriteLine(string.Join(",", quoted));

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddNewRecord failed");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult publishedSelected([FromBody] List<int> indexes)
        {
            if (indexes == null || indexes.Count == 0)
                return BadRequest(new { success = false, message = "No rows selected" });

            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "CSV");
            var source = Path.Combine(folder, "data.csv");
            var published = Path.Combine(folder, "published.csv");

            if (!System.IO.File.Exists(source))
                return NotFound("Source CSV not found.");

        
            List<CsvRecord> allRecords;
            var readConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                MissingFieldFound = null,
                HeaderValidated = null,
                BadDataFound = null
            };
            using (var reader = new StreamReader(source))
            using (var csv = new CsvReader(reader, readConfig))
            {
                csv.Context.RegisterClassMap<CsvRecordMap>();
                allRecords = csv.GetRecords<CsvRecord>().ToList();
            }

        
            var toPublish = indexes
                .Where(i => i >= 0 && i < allRecords.Count)
                .Select(i => allRecords[i])
                .ToList();
            if (!toPublish.Any())
                return BadRequest("No matching records found.");

      
            var exists = System.IO.File.Exists(published);
            using (var writer = new StreamWriter(published, append: true))
            using (var csvW = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                if (!exists)
                {
                    csvW.WriteHeader<CsvRecord>();
                    csvW.NextRecord();
                }
                csvW.WriteRecords(toPublish);
            }

            return Ok(new { message = $"Published {toPublish.Count} record(s)." });
        }

        [HttpPost]
        public IActionResult SaveCsv([FromBody] string csvData)
        {
            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "exports");
            Directory.CreateDirectory(folder);
            var filePath = Path.Combine(folder, "table_data.csv");
            System.IO.File.WriteAllText(filePath, csvData);
            return Ok(new { message = "Saved!", path = "/exports/table_data.csv" });
        }

        [HttpGet]
        public IActionResult LoadCsv()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(),
                                    "wwwroot", "exports", "table_data.csv");
            if (!System.IO.File.Exists(path))
                return NotFound("Export CSV not found.");

            using var reader = new StreamReader(path);
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                PrepareHeaderForMatch = args => args.Header.Trim(),
                HeaderValidated = null,
                MissingFieldFound = null
            };
            using var csv = new CsvReader(reader, config);
            var records = csv.GetRecords<Foo>().ToList();
            return Json(records);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
            => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
  
    public sealed class CsvRecordMap : ClassMap<CsvRecord>
    {
        public CsvRecordMap()
        {
            Map(m => m.Locales_Id).Name("Locales_Id");
            Map(m => m.PageFriendlyName).Name("PageFriendlyName");
            Map(m => m.LabelFriendlyName).Name("LabelFriendlyName");
            Map(m => m.Text).Name("Text");
        }
    }
  
    public class Foo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
    }
}
