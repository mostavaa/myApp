namespace serverApp.ViewModels
{
  public class ReturnResponse
  {
    public bool status { get; set; }
    public string[] messages { get; set; }
    public object data { get; set; }
  }
}
