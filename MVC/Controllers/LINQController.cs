using Microsoft.AspNetCore.Mvc;
using MVC.Models;
using System.Collections.Generic;
using System.Linq;

namespace MVC.Controllers
{
    public class LINQController : Controller
    {
        // Main student list
        List<Student> students = new List<Student>
        {
            new Student { FirstName = "Sara", LastName = "Mills", Group = 1, Age = 30 },
            new Student { FirstName = "Andrew", LastName = "Gibson", Group = 2, Age = 25 },
            new Student { FirstName = "Craig", LastName = "Ellis", Group = 1, Age = 21 },
            new Student { FirstName = "Steven", LastName = "Cole", Group = 2, Age = 53 },
            new Student { FirstName = "Andrew", LastName = "Carter", Group = 2, Age = 22 },
        };

        // Specialty list
        List<StudentSpecialty> specialties = new List<StudentSpecialty>
        {
            new StudentSpecialty { SpecialtyName = "Web Developer", FacultyNumber = "12345" },
            new StudentSpecialty { SpecialtyName = "Cyber Security", FacultyNumber = "12345" },
            new StudentSpecialty { SpecialtyName = "Game Dev", FacultyNumber = "11223" },
            new StudentSpecialty { SpecialtyName = "AI Research", FacultyNumber = "99887" }
        };

        // Intentional typo class Studentt list (fixed declaration)
        List<Studentt> studentts = new List<Studentt>
        {
            new Studentt { FirstName = "John", FacultyNumber = "12345" },
            new Studentt { FirstName = "Alice", FacultyNumber = "11223" },
            new Studentt { FirstName = "Zane", FacultyNumber = "99887" },
            new Studentt { FirstName = "Bob", FacultyNumber = "00001" } // no match
        };

        public IActionResult LINQ()
        {
            return View(students); // View expects List<Student>
        }

        [HttpPost]
        public IActionResult ModifyData()
        {
            var result = studentts
                .Join(specialties,
                      student => student.FacultyNumber,
                      specialty => specialty.FacultyNumber,
                      (student, specialty) => new
                      {
                          FullName = student.FirstName,
                          student.FacultyNumber,
                          specialty.SpecialtyName
                      })
                .OrderBy(x => x.FullName)
                .ToList();

            return PartialView("_StudentListPartial", result);
        }

    }

    // Specialty model
    public class StudentSpecialty
    {
        public string SpecialtyName { get; set; }
        public string FacultyNumber { get; set; }
    }

    // Intentional typo class
    public class Studentt
    {
        public string FirstName { get; set; }
        public string FacultyNumber { get; set; } // kept typo + string type to match data
    }
}
