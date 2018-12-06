using System;
using System.Linq;

namespace Data.Repositories
{
  public class AppUserRepository:Repository<AppUser>
    {
        public AppUserRepository(ClothesContext context):base(context){}

    public AppUser GetByUsernameAndPassword(string username, string password)
    {
      return Get(o => o.Username == username && o.Password == password).FirstOrDefault();
    }

    public AppUser GetByRefreshToken(Guid refreshToken)
    {
      return Get(o => o.refreshToken == refreshToken).FirstOrDefault();

    }

    public bool IsUsernameExist(string username)
    {
      return Get(o => o.Username.ToLower() == username.ToLower()).Any();
    }

    public void AddNewUser(AppUser user)
    {
      Add(user);
    }
  }
}
