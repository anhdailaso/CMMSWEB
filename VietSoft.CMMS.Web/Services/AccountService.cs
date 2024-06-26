﻿using Dapper;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Serilog;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.VisualBasic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace VietSoft.CMMS.Web.Services
{
    public class AccountService :  IAccountService
    {
        private readonly IDapperService _dapper;
        public readonly ILogger<AccountService> _logger;
        private readonly IConfiguration _config;
        public AccountService(IDapperService dapper, IConfiguration config)
        {
            _dapper = dapper;
            _config = config;
        }
        public int Login(string userName, string passWord)
        {
            try
            {
                string? passwordEncrypt = MaHoamd5.MaHoamd5.Encrypt(passWord, true);
                string sql = $"SELECT COUNT(*) FROM dbo.USERS WHERE USERNAME = N'"+userName+"' AND PASS = N'"+ MaHoaDL(passWord) +"' AND ACTIVE = 1";
                return _dapper.Get<int>(sql, null, System.Data.CommandType.Text);
            }
            catch (Exception ex)
            {
                CommonLogger.LogError(_logger, userName, ex, "Loggin Error");
                return 0;
            }
        }
        public string MaHoaDL(string str)
        {
            double dLen = str.Length;
            string sTam = "";
            const int _CODE_ = 354;
            for (int i = 1; i <= dLen; i++)
                sTam += Strings.ChrW((Strings.AscW(Strings.Mid(str, i, 1)) + _CODE_) * 2).ToString();
            return sTam;
        }
        string GiaiMaDL(string str)
        {
            string sTam = "";
            const int _CODE_ = 354;
            for (int i = 0; i < str.Length; i++)
            {
                sTam += System.Convert.ToChar(((int)System.Convert.ToChar(str.Substring(i, 1)) / 2) - _CODE_).ToString();
            }
            return sTam;
        }


        public UserModel GetProfile(string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GETPROFILE");
                p.Add("@UserName", userName);
                var res = _dapper.Execute<UserModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                res.Avatar = Convert.ToBase64String(res.HINH_CN);
                return res;
            }
            catch (Exception ex)
            {
                return new UserModel();
            }
        }

        public ThongTinChungViewModel GetThongTinChung(string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GENERAL");
                p.Add("@UserName", userName);
                var res = _dapper.Execute<ThongTinChungViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if(res.DUONG_DAN_TL == "" || res.DUONG_DAN_TL == null)
                {
                    res.DUONG_DAN_TL = _config["RootPath"];

                }    
                return res;
            }
            catch (Exception ex)
            {
                return new ThongTinChungViewModel();
            }
        }


        public List<SelectListItem> GetDatabaseList()
        {
            string sql = "SELECT DISTINCT name FROM sys.databases WHERE state_desc = 'ONLINE' AND name LIKE 'CMMS%' ORDER BY name";
            var lstDbName = _dapper.GetAll<string>(sql, null, System.Data.CommandType.Text);

            return lstDbName.Select(x => new SelectListItem()
            {
                Text = x,
                Value = x
            }).ToList();
        }


    }
}
