﻿using Dapper;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Serilog;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.Data.SqlClient;
using VietSoft.CMMS.Web.Helpers;
using System.Reflection;
using System.Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.ApplicationBlocks.Data;

namespace VietSoft.CMMS.Web.Services
{
    public class ComboboxService :  IComboboxService
    {
        private readonly IDapperService _dapper;
        private readonly ILogger<ComboboxService> _logger;
        public ComboboxService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public SelectList DanhSachNguyenNhan()
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, System.Data.CommandType.Text, "SELECT MS_NGUYEN_NHAN AS 'Value',TEN_NGUYEN_NHAN AS 'Text' FROM NGUYEN_NHAN_DUNG_MAY ORDER BY TEN_NGUYEN_NHAN"));
            var listItem = tb.AsEnumerable().Select(
                  x => new SelectListItem
                  {
                      Text = x.Field<string>("Text"),
                      Value = x.Field<int>("Value").ToString()
                  });
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList DanhSachLoaiBT()
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, System.Data.CommandType.Text, "SELECT MS_LOAI_BT AS 'Value',TEN_LOAI_BT AS 'Text' FROM LOAI_BAO_TRI ORDER BY TEN_LOAI_BT"));
            var listItem = tb.AsEnumerable().Select(
                  x => new SelectListItem
                  {
                      Text = x.Field<string>("Text"),
                      Value = x.Field<int>("Value").ToString()
                  });
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList GetCbbDiaDiem(string Username, int NNgu, int CoAll)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "GetNhaXuongAll", Username, NNgu, CoAll));
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_N_XUONG"),
                 Value = x.Field<string>("MS_N_XUONG")
             });
            return new SelectList(listItem, "Value", "Text", null);
        }
        public SelectList GetCbbHeThong(string Username, int NNgu, int CoAll)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "GetHeThongAll", CoAll, Username, NNgu));
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_HE_THONG"),
                 Value = x.Field<int>("MS_HE_THONG").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }
        public SelectList GetCbbLoaiMay(string Username, int NNgu, int CoAll)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "GetLoaiMayAll", CoAll, Username, NNgu));
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_LOAI_MAY"),
                 Value = x.Field<string>("MS_LOAI_MAY")
             });
            return new SelectList(listItem, "Value", "Text", null);
        }
        public SelectList GetCbbMay(string DD,int DC,string Username, int NNgu, int CoAll)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "SP_Y_GET_MAY", Username, NNgu, "-1", DD, DC, "-1", "-1", "-1"));
            tb.Rows.Add("-1", " < ALL > ", "-1");
            tb.DefaultView.Sort = "MS_MAY";
            tb = tb.DefaultView.ToTable();
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_MAY"),
                 Value = x.Field<string>("MS_MAY")
             });
            return new SelectList(listItem, "Value", "Text", null);
        }
        public SelectList GetCbbLoaiCV(string Username, int NNgu, int CoAll)
        {
            DataTable dtTmp = new DataTable();
            string sSql =
                        " SELECT T1.MS_LOAI_CV,T1.TEN_LOAI_CV FROM LOAI_CONG_VIEC T1 INNER JOIN NHOM_LOAI_CONG_VIEC T2 ON " +
                        " T1.MS_LOAI_CV = T2.MS_LOAI_CV INNER JOIN USERS T3 ON T2.GROUP_ID = T3.GROUP_ID " +
                        " WHERE USERNAME = '" + Username + "' UNION  SELECT -1, ' < ALL > ' " +
                        " ORDER BY TEN_LOAI_CV";
            dtTmp.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, CommandType.Text, sSql));
            var listItem = dtTmp.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_LOAI_CV"),
                 Value = x.Field<int>("MS_LOAI_CV").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }

     
        public SelectList LoadListThietBi()
        {
            DataTable dtTmp = new DataTable();
            SqlCommand sqlcom = new SqlCommand();
            SqlConnection con = new SqlConnection(_dapper.GetDbconnection().ConnectionString);
            if (con.State == ConnectionState.Closed)
                con.Open();
            sqlcom.Connection = con;
            sqlcom.Parameters.AddWithValue("ACTION", "LIST_THIET_BI");
            sqlcom.CommandType = CommandType.StoredProcedure;
            sqlcom.CommandText = "VS_ST_HazardReport";
            SqlDataAdapter da = new SqlDataAdapter(sqlcom);
            da.Fill(dtTmp);
            var listItem = dtTmp.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("Staffname"),
                 Value = x.Field<string>("ID").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }
        public SelectList LoadListNguyenNhan()
        {
            DataTable dtTmp = new DataTable();
            SqlCommand sqlcom = new SqlCommand();
            SqlConnection con = new SqlConnection(_dapper.GetDbconnection().ConnectionString);
            if (con.State == ConnectionState.Closed)
                con.Open();
            sqlcom.Connection = con;
            sqlcom.Parameters.AddWithValue("ACTION", "LIST_NGUYEN_NHAN");
            sqlcom.CommandType = CommandType.StoredProcedure;
            sqlcom.CommandText = "VS_ST_HazardReport";
            SqlDataAdapter da = new SqlDataAdapter(sqlcom);
            da.Fill(dtTmp);
            var listItem = dtTmp.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("Staffname"),
                 Value = x.Field<int>("ID").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }
        public SelectList LoadListLoaiYC()
        {
            DataTable dtTmp = new DataTable();
            SqlCommand sqlcom = new SqlCommand();
            SqlConnection con = new SqlConnection(_dapper.GetDbconnection().ConnectionString);
            if (con.State == ConnectionState.Closed)
                con.Open();
            sqlcom.Connection = con;
            sqlcom.Parameters.AddWithValue("ACTION", "LIST_LOAI_YEU_CAU");
            sqlcom.CommandType = CommandType.StoredProcedure;
            sqlcom.CommandText = "VS_ST_HazardReport";
            SqlDataAdapter da = new SqlDataAdapter(sqlcom);
            da.Fill(dtTmp);
            var listItem = dtTmp.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("Staffname"),
                 Value = x.Field<int>("ID").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }
        public SelectList LoadListUuTien(int NN)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "H_YEU_CAU_NSD_MUC_UU_TIEN"));
            var listItem = tb.AsEnumerable().Select(
                  x => new SelectListItem
                  {
                      Text = x.Field<string>("TEN_UU_TIEN"),
                      Value = x.Field<int>("MS_UU_TIEN").ToString()
                  });
            return new SelectList(listItem, "Value", "Text", null);
        }


        // Đạt sửa 10101999
        public SelectList GetCbbBoPhan(string Username, int NNgu, int CoAll)
        {
            DataTable dtTmp = new DataTable();
            SqlCommand sqlcom = new SqlCommand();
            SqlConnection con = new SqlConnection(_dapper.GetDbconnection().ConnectionString);
            if (con.State == ConnectionState.Closed)
                con.Open();
            sqlcom.Connection = con;
            sqlcom.Parameters.AddWithValue("@sDanhMuc", "HISTORY");
            sqlcom.Parameters.AddWithValue("@UName", Username);
            sqlcom.Parameters.AddWithValue("@iLoai", 0);
            sqlcom.Parameters.AddWithValue("@NNgu", NNgu);
            sqlcom.Parameters.AddWithValue("@CoAll", CoAll);
            sqlcom.CommandType = CommandType.StoredProcedure;
            sqlcom.CommandText = "spWBaoTri";
            SqlDataAdapter da = new SqlDataAdapter(sqlcom);
            da.Fill(dtTmp);

            var listItem = dtTmp.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_BP"),
                 Value = x.Field<int>("MA_BP").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList GetCbbPhuTung(string Username, int NNgu, int CoAll)
        {
            DataTable dtTmp = new DataTable();
            SqlCommand sqlcom = new SqlCommand();
            SqlConnection con = new SqlConnection(_dapper.GetDbconnection().ConnectionString);
            if (con.State == ConnectionState.Closed)
                con.Open();
            sqlcom.Connection = con;
            sqlcom.Parameters.AddWithValue("@sDanhMuc", "HISTORY");
            sqlcom.Parameters.AddWithValue("@UName", Username);
            sqlcom.Parameters.AddWithValue("@iLoai", 1);
            sqlcom.Parameters.AddWithValue("@NNgu", NNgu);
            sqlcom.Parameters.AddWithValue("@CoAll", CoAll);
            sqlcom.CommandType = CommandType.StoredProcedure;
            sqlcom.CommandText = "spWBaoTri";
            SqlDataAdapter da = new SqlDataAdapter(sqlcom);
            da.Fill(dtTmp);

            var listItem = dtTmp.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_PT"),
                 Value = x.Field<string>("MS_PT").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }

        //Đạt sửa 26122022
        public SelectList GetCbbNYC(string Username, int NNgu, int CoAll)
        {
            DataTable dtTmp = new DataTable();
            SqlCommand sqlcom = new SqlCommand();
            SqlConnection con = new SqlConnection(_dapper.GetDbconnection().ConnectionString);
            if (con.State == ConnectionState.Closed)
                con.Open();
            sqlcom.Connection = con;
            sqlcom.Parameters.AddWithValue("@sDanhMuc", "HISTORY_REQUEST");
            sqlcom.Parameters.AddWithValue("@UName", Username);
            sqlcom.Parameters.AddWithValue("@iLoai", 0);
            sqlcom.Parameters.AddWithValue("@NNgu", NNgu);
            sqlcom.Parameters.AddWithValue("@CoAll", CoAll);
            sqlcom.CommandType = CommandType.StoredProcedure;
            sqlcom.CommandText = "spWBaoTri";
            SqlDataAdapter da = new SqlDataAdapter(sqlcom);
            da.Fill(dtTmp);

            var listItem = dtTmp.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_NYC"),
                 Value = x.Field<int>("ID_NYC").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }

    }
}
