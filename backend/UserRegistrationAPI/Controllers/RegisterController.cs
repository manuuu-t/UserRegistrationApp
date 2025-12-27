using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using UserRegistrationAPI.Models;

namespace UserRegistrationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly IConfiguration _config;

        public RegisterController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public IActionResult Register(UserModel user)
        {
            using SqlConnection con = new SqlConnection(
                _config.GetConnectionString("DbConn"));

            con.Open();

            SqlCommand checkCmd =
                new SqlCommand("SELECT COUNT(*) FROM Users WHERE Email=@Email", con);

            checkCmd.Parameters.AddWithValue("@Email", user.Email);

            int exists = (int)checkCmd.ExecuteScalar();

            if (exists > 0)
                return BadRequest("Email already exists");

            SqlCommand cmd = new SqlCommand(
            @"INSERT INTO Users
            (FirstName, LastName, DateOfBirth, Email, PasswordHash, PhoneNumber)
            VALUES (@F,@L,@DOB,@E,@P,@PH)", con);

            cmd.Parameters.AddWithValue("@F", user.FirstName);
            cmd.Parameters.AddWithValue("@L", user.LastName);
            cmd.Parameters.AddWithValue("@DOB", user.DateOfBirth);
            cmd.Parameters.AddWithValue("@E", user.Email);
            cmd.Parameters.AddWithValue("@P", user.Password);
            cmd.Parameters.AddWithValue("@PH",
                string.IsNullOrEmpty(user.PhoneNumber) ? DBNull.Value : user.PhoneNumber);

            cmd.ExecuteNonQuery();

            return Ok("Registered Successfully");
        }
    }
}
