namespace MVC.Models
{
    public class CsvRecord
    {
        public int Locales_Id { get; set; }
        public string PageName { get; set; }
        public string PageFriendlyName { get; set; }
        public string LabelName { get; set; }
        public string LabelFriendlyName { get; set; }
        public string Text { get; set; }
        public string DateCreated { get; set; }
        public string DateModified { get; set; }
        public string Note { get; set; }

        public int IsHTML { get; set; }
        public string CMS_WidgetName { get; set; }
        public string CMS_Category { get; set; }
        public int CMS_IsHidden { get; set; }
        public string CMS_PreviewURL { get; set; }
    }
}
