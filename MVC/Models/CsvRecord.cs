using System.ComponentModel.DataAnnotations;

namespace MVC.Models
{
    public class CsvRecord
    {
        [Required]
        public int Locales_Id { get; set; }
        [Required]
        public string PageFriendlyName { get; set; }
        [Required]
        public string LabelFriendlyName { get; set; }
        [Required]
        public string Text { get; set; }
    }
}
