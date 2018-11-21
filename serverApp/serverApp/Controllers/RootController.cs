using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Threading;
using System.Globalization;
namespace serverApp.Controllers
{
    
    public class RootController : Controller
    {
    public override void OnActionExecuting(ActionExecutingContext context)
    {
      base.OnActionExecuting(context);
      if (context.HttpContext.Request.Query.ContainsKey("lang"))
      {
        string lang = context.HttpContext.Request.Query["lang"];
        if (lang == "en")
          Thread.CurrentThread.CurrentUICulture = new CultureInfo("en-US");
        else
          Thread.CurrentThread.CurrentUICulture = new CultureInfo("ar-EG");
      }
    }
  }
}
