using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Clothes_Ad.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.UI.Pages.Account.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Clothes_Ad.Controllers
{

    [Route("api/auth")]
    [ApiController]
    public class AuthController : Controller
    {
        public class loginViewModel
        {
            public string username { get; set; }
            public string password { get; set; }
        }
        // GET api/values
        [HttpPost, Route("login")]
        public IActionResult Login([FromBody]loginViewModel model)
        {
            if (string.IsNullOrEmpty(model.username) || string.IsNullOrEmpty(model.password))
            {
                return BadRequest("Invalid client request");
            }
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, model.username),
                new Claim(ClaimTypes.Role, "Manager")
            };
            if (model.username == "johndoe" && model.password == "def@123")
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.SymmetricSecurityKey));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                var tokeOptions = new JwtSecurityToken(
                    issuer: Constants.ValidIssuer,
                    audience: Constants.ValidAudience,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(5),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString });
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}
