using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using serverApp.Controllers;
using Data;
using Data.Repositories;
using Microsoft.Extensions.Localization;

namespace serverApp.Models.Business
{
  public interface IAuthBusiness
  {
    IUnitOfWork UnitOfWork { get; set; }
    List<string> Errors { get; set; }
    bool IsValid(AppUser user);
  }
  public class AuthBusiness : IAuthBusiness
  {
    public IUnitOfWork UnitOfWork { get; set; }
    public IStringLocalizer<SharedResources> Localizer { get; }

    public AuthBusiness(IUnitOfWork unitOfWork, IStringLocalizer<SharedResources> localizer)
    {
      UnitOfWork = unitOfWork;
      Localizer = localizer;
      Errors = new List<string>();
    }

    public List<string> Errors { get; set; }
    public bool IsValid(AppUser user)
    {
      Errors = new List<string>();
      if (user.Username.Length < 3)
        Errors.Add(Localizer["usernameLengthError"]);
      if (user.Password.Length < 3)
        Errors.Add(Localizer["passwordLengthError"]);
      if (UnitOfWork.AppUserRepository.Get(o => o.Username.ToLower() == o.Username.ToLower()).Any())
        Errors.Add(Localizer["usernameUniqueError"]);
      return Errors.Count == 0;
    }


  }
}
