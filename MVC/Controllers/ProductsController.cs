using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using MVC.Models;

namespace MVC.Controllers
{
    public class ProductsController : Controller
    {
        public IActionResult CSV()
        {
            return View();
        }



        [HttpGet] public IActionResult ReturnFullList() 
        {
            using (var reader = new StreamReader("wwwroot/CSV/Products.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var records = csv.GetRecords<ProductsModel>().ToList();
                return Json(records);
            }
        }
        [HttpGet]
        public IActionResult GetProductsByCategory(string Category, string? sortBy, string? sortOrder)
        {
            using (var reader = new StreamReader("wwwroot/CSV/Products.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var records = csv.GetRecords<ProductsModel>().ToList();

                Console.WriteLine($"SortBy: {sortBy}, SortOrder: {sortOrder}");

                var filtered = Category == "All" || string.IsNullOrWhiteSpace(Category)
                    ? records
                    : records.Where(x => x.Category == Category).ToList();

                sortOrder = sortOrder?.Trim().ToLower(); 
                sortBy = sortBy?.Trim().ToLower();      
                bool desc = sortOrder == "desc";

                if (!string.IsNullOrEmpty(sortBy))
                {
                    filtered = sortBy switch
                    {
                        "price" => desc ? filtered.OrderByDescending(p => p.Price).ToList()
                                        : filtered.OrderBy(p => p.Price).ToList(),

                        "name" => desc ? filtered.OrderByDescending(p => p.Name).ToList()
                                       : filtered.OrderBy(p => p.Name).ToList(),

                        _ => filtered
                    };

                }

                return Json(filtered);
            }
        }


        [HttpPost]
        [HttpPost]
        public IActionResult ReadFile(IFormFile file)
        {
            List<ProductsModel> newProducts;
            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                newProducts = csv.GetRecords<ProductsModel>().ToList();
            }

            List<ProductsModel> oldRecords;
            using (var oldReader = new StreamReader("wwwroot/CSV/Products.csv"))
            using (var oldCsv = new CsvReader(oldReader, CultureInfo.InvariantCulture))
            {
                oldRecords = oldCsv.GetRecords<ProductsModel>().ToList();
            }

            var combined = oldRecords.Concat(newProducts).ToList();

            using (var writer = new StreamWriter("wwwroot/CSV/Products.csv"))
            using (var csvWriter = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                csvWriter.WriteRecords(combined);
            }

            return Json(new { message = "Upload complete!", totalProducts = combined.Count });
        }

        [HttpPost]
        public IActionResult GenerateCategoryPriceReport()
        {
            using (var reader = new StreamReader("wwwroot/CSV/Products.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var records = csv.GetRecords<ProductsModel>().ToList();
                var filtered = records.GroupBy(x => x.Category)
                    .Select(g => new
                    {
                        Category = g.Key,
                        AvaregePrice = g.Average(p => p.Price)
                    }).ToList();

                using (var writer = new StreamWriter("wwwroot/CSV/CategoryAverages.csv"))
                using (var Csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    Csv.WriteRecords(filtered);
                }

                return Json(new { message = "Submitted Correctly" });
            }
        }
    }
}
