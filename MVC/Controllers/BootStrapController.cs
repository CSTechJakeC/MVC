using Microsoft.AspNetCore.Mvc;

namespace MVC.Controllers
{
    public class BootStrapController : Controller
    {
        public IActionResult BlogView()
        {
            return View();
        }
        public IActionResult BView()
        {
            return View();
        }
    }
}
