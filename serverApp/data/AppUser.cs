
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data
{
  public class AppUser : Entity
  {
    public string Username { get; set; }
    public string Password { get; set; }
    public string Mail { get; set; }
    [NotMapped]
    public Guid refreshToken { get; set; }
  }
}
