using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using serverApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.UI.Pages.Account.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Data;
using Data.Repositories;
using serverApp.ViewModels;
using Microsoft.Extensions.Localization;
using serverApp.Models.Business;

namespace serverApp.Controllers
{

  [Route("api/auth")]
  [ApiController]
  public class AuthController : RootController
  {
    private readonly IUnitOfWork unitOfWork;
    private readonly IStringLocalizer<SharedResources> authLocalizer;
    private readonly IAuthBusiness authBusiness;

    public AuthController(
            IUnitOfWork unitOfWork,
            IStringLocalizer<SharedResources> authLocalizer,
            IAuthBusiness authBusiness
            )
    {
      this.unitOfWork = unitOfWork;
      this.authLocalizer = authLocalizer;
      this.authBusiness = authBusiness;
    }

    private string GenerateTokens(string UserName, List<string> Claims)
    {
      var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.SymmetricSecurityKey));
      var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

      var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, UserName),
                    };
      foreach (var item in Claims)
      {
        claims.Add(new Claim(ClaimTypes.Role, item));
      }
      var tokeOptions = new JwtSecurityToken(
          issuer: "http://localhost:44344",
          audience: "http://localhost:44344",
          claims: claims,
          expires: DateTime.Now.AddMonths(3),
          signingCredentials: signinCredentials
      );

      var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
      return tokenString;
    }
    // POST: api/Auth
    [HttpPost]
    public ActionResult Login([FromBody] AppUser user)
    {
      AppUser dbUser = unitOfWork.AppUserRepository.Get(o => o.Username == user.Username && o.Password == user.Password).FirstOrDefault();
      if (dbUser != null)
      {
        return Ok(new ReturnResponse() { status = true, data = new { accessToken = GenerateTokens(dbUser.Username, new List<string>()), refreshToken = dbUser.Guid } });
      }

      if (user.refreshToken != Guid.Empty)
      {
        dbUser = unitOfWork.AppUserRepository.Get(o => o.Guid == user.refreshToken).FirstOrDefault();
        if (dbUser != null)
        {
          return Ok(new ReturnResponse() { status = true, data = new { accessToken = GenerateTokens(dbUser.Username, new List<string>()), refreshToken = dbUser.Guid } });
        }
      }
      return BadRequest(new ReturnResponse() { status = false, messages = new string[] { authLocalizer["WrongUserNameOrPassword"] } });
    }
    // POST: api/Auth
    [HttpPost]
    [Route("register")]
    public ActionResult Register([FromBody] AppUser user)
    {
      if (authBusiness.IsValid(user))
      {
        unitOfWork.AppUserRepository.Add(user);
        try
        {
          unitOfWork.Commit();
          return Ok((new ReturnResponse
          {
            status = true,
            data = new
            {
              accessToken = GenerateTokens(user.Username, new List<string>()),
              refreshToken = user.Guid
            }
          }));
        }
        catch (Exception)
        {

          throw;
        }
      }
      else
      {
        return BadRequest(new ReturnResponse()
        {
          status = false,
          messages = authBusiness.Errors.ToArray()
        });
      }

    }


  }
}
