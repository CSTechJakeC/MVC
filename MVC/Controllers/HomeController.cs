using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Elfie.Serialization; // This is probably unnecessary — remove if unused
using MVC.Models;
using System.Diagnostics;
using System.Globalization;
using System.Text.Json;

namespace MVC.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index() => View();
        public IActionResult ListGen() => View();
        public IActionResult Table() => View();
        public IActionResult Game() => View();

        [HttpPost]
        public IActionResult SaveCsv([FromBody] string csvData)
        {
            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "exports");
            Directory.CreateDirectory(folderPath);

            string filePath = Path.Combine(folderPath, "table_data.csv");
            System.IO.File.WriteAllText(filePath, csvData);

            return Ok(new { message = "Saved!", path = "/exports/table_data.csv" });
        }

        public IActionResult LoadCsv()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "exports", "table_data.csv");

            if (!System.IO.File.Exists(path))
                return NotFound("CSV not found");

            using var reader = new StreamReader(path);
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                PrepareHeaderForMatch = args => args.Header.Trim(), // case-insensitive match
                HeaderValidated = null,
                MissingFieldFound = null
            };
            var csv = new CsvHelper.CsvReader(reader, config);
            var records = csv.GetRecords<Foo>().ToList();

            return Json(records);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }

  
    public class Foo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
    }
}
