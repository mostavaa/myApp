using System.Globalization;
using System.Text;
using serverApp.Models;
using serverApp.Models.Business;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Data;
using Data.Repositories;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace serverApp
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddLocalization(o => o.ResourcesPath = "Resources");
      services.Configure<RequestLocalizationOptions>(options =>
      {
        var supportedCultures = new[]
        {
                    new CultureInfo("en-US"),
                    new CultureInfo("ar-EG"),
                };
        options.DefaultRequestCulture = new RequestCulture("en-US", "en-US");
        options.SupportedCultures = supportedCultures;
        options.SupportedUICultures = supportedCultures;
      });

      services.AddCors(options =>
      {
        options.AddPolicy("EnableCORS", builder =>
        {
          builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().AllowCredentials().Build();
        });
      });

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddJwtBearer(options =>
          {
            options.TokenValidationParameters = new TokenValidationParameters
            {
              ValidateIssuer = true,
              ValidateAudience = true,
              ValidateLifetime = true,
              ValidateIssuerSigningKey = true,

              ValidIssuer = Constants.ValidIssuer,
              ValidAudience = Constants.ValidAudience,
              IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.SymmetricSecurityKey))
            };
          });
      services.AddDbContext<ClothesContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"))
      );
      services.AddTransient<IUnitOfWork, UnitOfWork>();
      services.AddTransient<IDepartmentsBusiness, DepartmentsBusiness>();
      services.AddTransient<IProductsBusiness, ProductsBusiness>();
      services.AddTransient<IAuthBusiness, AuthBusiness>();
      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseHsts();
      }
      app.UseCors("EnableCORS");

      app.UseAuthentication();

      app.UseHttpsRedirection();
     // app.UseFileServer();

      var options = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
      app.UseRequestLocalization(options.Value);


      //
      app.Use(async (context, next) =>
      {
        await next();
        if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
        {
          context.Request.Path = "/index.html";
          await next();
        }
      });

      app.UseStaticFiles();

      app.UseMvc(routes =>
      {

      });

     
    }
  }
}
