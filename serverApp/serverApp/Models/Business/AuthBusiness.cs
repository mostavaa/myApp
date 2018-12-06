using System;
using System.Collections.Generic;
using Data;
using Data.Repositories;
using Microsoft.Extensions.Localization;
using serverApp.ViewModels;

namespace serverApp.Models.Business
{
  public interface IAuthBusiness
  {
    ReturnResponse Login(AppUser user);
    ReturnResponse Register(AppUser user);
  }
  public class AuthBusiness : IAuthBusiness
  {
    private IUnitOfWork UnitOfWork { get; set; }
    private IStringLocalizer<SharedResources> Localizer { get; }
    private List<string> Errors { get; set; }
    public AuthBusiness(IUnitOfWork unitOfWork, IStringLocalizer<SharedResources> localizer)
    {
      UnitOfWork = unitOfWork;
      Localizer = localizer;
      Errors = new List<string>();
    }

    private bool IsValidUser(AppUser user)
    {
      Errors = new List<string>();
      if (user.Username.Length < 3)
        Errors.Add(Localizer["usernameLengthError"]);
      if (user.Password.Length < 3)
        Errors.Add(Localizer["passwordLengthError"]);
      if (UnitOfWork.AppUserRepository.IsUsernameExist(user.Username))
        Errors.Add(Localizer["usernameUniqueError"]);
      return Errors.Count == 0;
    }

    public ReturnResponse Register(AppUser user)
    {
      if (IsValidUser(user))
      {
        UnitOfWork.AppUserRepository.AddNewUser(user);
        try
        {
          UnitOfWork.Commit();
          return (new ReturnResponse
          {
            status = true,
            data = new
            {
              accessToken = Token.GenerateTokens(user.Username, new List<string>()),
              refreshToken = user.Guid
            }
          });
        }
        catch (Exception)
        {
          return new ReturnResponse() { status = false, messages = new string[] { Localizer["ServerError"] } };
        }
      }
      else
      {
        return new ReturnResponse()
        {
          status = false,
          messages = Errors.ToArray()
        };
      }
    }

    public ReturnResponse Login(AppUser user)
    {
      AppUser dbUser = UnitOfWork.AppUserRepository.GetByUsernameAndPassword(user.Username, user.Password);
      if (dbUser != null)
      {
        return new ReturnResponse() { status = true, data = new { accessToken = Token.GenerateTokens(dbUser.Username, new List<string>()), refreshToken = dbUser.Guid } };
      }

      if (user.refreshToken != Guid.Empty)
      {
        dbUser = UnitOfWork.AppUserRepository.GetByRefreshToken(user.refreshToken);
        if (dbUser != null)
        {
          return new ReturnResponse() { status = true, data = new { accessToken = Token.GenerateTokens(dbUser.Username, new List<string>()), refreshToken = dbUser.Guid } };
        }
      }
      return new ReturnResponse() { status = false, messages = new string[] { Localizer["WrongUserNameOrPassword"] } };
    }
  }
}
