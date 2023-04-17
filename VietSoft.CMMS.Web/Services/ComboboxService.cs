using Dapper;
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
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.CMMS.Web.Services
{
    public class ComboboxService : IComboboxService
    {
        private readonly IDapperService _dapper;
        public ComboboxService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public SelectList DangPhanBo(int NNgu)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString,CommandType.Text, "SELECT CONVERT(INT,1) AS DANG_PB,(SELECT (CASE "+ NNgu +" WHEN 0 THEN VIETNAM WHEN 1 THEN ISNULL(NULLIF(ENGLISH,''),VIETNAM) END)  FROM dbo.LANGUAGES WHERE KEYWORD ='cmbPhanBoTheoSoLuong')  AS TEN_PB UNION SELECT 2 AS DANG_PB,(SELECT (CASE "+ NNgu + " WHEN 0 THEN VIETNAM WHEN 1 THEN ISNULL(NULLIF(ENGLISH,''),VIETNAM) END) FROM dbo.LANGUAGES WHERE KEYWORD ='cmbPhanBoTheoGiatri')  AS TEN_PB ORDER BY DANG_PB"));
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_PB"),
                 Value = x.Field<int>("DANG_PB").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList CboNgoaiTe()
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, CommandType.Text, "SELECT NGOAI_TE,TEN_NGOAI_TE FROM dbo.NGOAI_TE ORDER BY MAC_DINH DESC,NGOAI_TE"));
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("NGOAI_TE"),
                 Value = x.Field<string>("TEN_NGOAI_TE")
             });
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList DanhSachKho(string Username)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "SP_Y_GET_KHO_DON_HANG_NHAP", Username));
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_KHO"),
                 Value = x.Field<int>("MS_KHO").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }



        public SelectList DanhSachNguyenNhan(int NNgu)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, System.Data.CommandType.Text, "SELECT MS_NGUYEN_NHAN AS 'Value',CASE "+ NNgu + " WHEN 0 THEN TEN_NGUYEN_NHAN ELSE ISNULL(NULLIF(TEN_NGUYEN_NHAN_ANH,''),TEN_NGUYEN_NHAN)  END  AS 'Text' FROM NGUYEN_NHAN_DUNG_MAY ORDER BY TEN_NGUYEN_NHAN"));
            var listItem = tb.AsEnumerable().Select(
                  x => new SelectListItem
                  {
                      Text = x.Field<string>("Text"),
                      Value = x.Field<int>("Value").ToString()
                  }).OrderBy(x => x.Text);
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList DanhSachLoaiBT()
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, System.Data.CommandType.Text, "SELECT MS_LOAI_BT AS 'Value',TEN_LOAI_BT AS 'Text',HU_HONG FROM LOAI_BAO_TRI ORDER BY TEN_LOAI_BT"));
            var listItem = tb.AsEnumerable().Select(
                  x => new SelectListItem
                  {
                      Text = x.Field<string>("Text"),
                      Value = x.Field<int>("Value").ToString()
                  }).OrderBy(x => x.Text);
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList DanhSachPhuTung(int NNgu)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, System.Data.CommandType.Text, "SELECT '-1' AS MS_PT,'' AS TEN_PT UNION SELECT MS_PT,CASE "+ NNgu + " WHEN 0 THEN TEN_PT WHEN 1 THEN ISNULL(NULLIF(TEN_PT_ANH,''),TEN_PT) ELSE ISNULL(NULLIF(TEN_PT_HOA,''),TEN_PT) END TEN_PT FROM dbo.IC_PHU_TUNG WHERE ACTIVE_PT = 1"));
            var listItem = tb.AsEnumerable().Select(
                  x => new SelectListItem
                  {
                      Text = x.Field<string>("TEN_PT"),
                      Value = x.Field<string>("MS_PT")
                  });
            return new SelectList(listItem, "Value", "Text", null);
        }

        public IEnumerable<MaintenanceCategoryViewModel> GetMaintenanceCategoy(int msHTBT)
        {
            try
            {
                string sql = "SELECT MS_LOAI_BT, TEN_LOAI_BT, HU_HONG FROM LOAI_BAO_TRI WHERE (MS_HT_BT = "+ msHTBT + " OR "+ msHTBT + " = -1 ) ORDER BY TEN_LOAI_BT";
                var res = _dapper.GetAll<MaintenanceCategoryViewModel>(sql, null, System.Data.CommandType.Text);

                return res ?? new List<MaintenanceCategoryViewModel>();
            }
            catch (Exception ex)
            {
                return new List<MaintenanceCategoryViewModel>();
            }
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

        public SelectList GetLoaiMayAll(string Username, int NNgu, int CoAll)
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

        public SelectList GetCbbDangNhap(string Username, int NNgu, int CoAll)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "SP_Y_GET_DANG_NHAP_KHO",NNgu));
            if (CoAll == 1)
            {
            }
            else
            {
                tb = tb.AsEnumerable().Where(x => Convert.ToInt32(x["MS_DANG_NHAP"]) < 9).CopyToDataTable();
                tb.Rows.Add(-1, "");
            }
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_DANG_NHAP"),
                 Value = x.Field<int>("MS_DANG_NHAP").ToString()
             }).OrderBy(x => x.Value);
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList GetCbbTrong()
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString,CommandType.Text," SELECT -1 as MA, '' as TEN "));
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN"),
                 Value = x.Field<int>("MA").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList GetCbbDangxuat(string Username, int NNgu, int CoAll)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "GetDANG_XUATALL",NNgu));

            if (CoAll == 1)
            {
            }
            else
            {
                tb = tb.AsEnumerable().Where(x => Convert.ToInt32(x["MS_DANG_XUAT"]) < 9).CopyToDataTable();
                tb.Rows.Add(-1, "");
            }
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("DANG_XUAT"),
                 Value = x.Field<int>("MS_DANG_XUAT").ToString()
             }).OrderBy(x => x.Value);
            return new SelectList(listItem, "Value", "Text", null);
        }

        //Phiếu bảo trì xuất
        public SelectList GetCbbPhieuBaoTriXuat()
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "QL_LIST_PHIEU_BAO_TRI"));
            DataRow newRow = tb.NewRow();
            newRow[0] = "-1";
            newRow[1] = "";
            tb.Rows.InsertAt(newRow,0);
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN"),
                 Value = x.Field<string>("MA")
             });
            return new SelectList(listItem, "Value", "Text", null);
        }
        //bộ phận chịu phí
        public SelectList GetCbbBoPhanChiuPhi(string Username)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "GetBPCPhiAll",0,Username));
            DataRow newRow = tb.NewRow();
            newRow[0] = "-1";
            newRow[1] = "";
            tb.Rows.InsertAt(newRow, 0);
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_BP_CHIU_PHI"),
                 Value = x.Field<int>("MS_BP_CHIU_PHI").ToString()
             }).OrderBy(x => x.Value);
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList GetCbbDDH(string Username, int NNgu, int CoAll, int dexuat)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "SP_Y_GET_DON_DAT_HANG_NHAP_KHO_1",Username));
            if (dexuat != -1)
            {
           
                tb = tb.AsEnumerable().Where(x => x["DON_HANG"].ToString() == dexuat.ToString()).Take(100).CopyToDataTable();
            }
            if (CoAll == 1)
            {
                DataRow newRow = tb.NewRow();
                newRow[0] = "-1";
                newRow[1] = " <ALL> ";
                newRow[2] = 0;
                tb.Rows.InsertAt(newRow, 0);
            }
            else
            {
                DataRow newRow = tb.NewRow();
                newRow[0] = "-1"; // Gán giá trị cho cột 1
                newRow[1] = ""; // Gán giá trị cho cột 2
                newRow[2] = 0; // Gán giá trị cho cột 3
                tb.Rows.InsertAt(newRow, 0);
            }
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_DON_DAT_HANG"),
                 Value = x.Field<string>("MS_DON_DAT_HANG")
             });
            return new SelectList(listItem, "Value", "Text", null);
        }


        public SelectList GetCbbNguoiNhap(string Username, int NNgu, int CoAll, int khachhang, int vaitro)
        {
            DataTable tb = new DataTable();

            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "SP_Y_GET_NGUOI_NHAP_KHO",Username));
            if(vaitro == -1)
            {

                tb = tb.AsEnumerable().Where(x =>Convert.ToInt32(x["VTRO"]) == vaitro).CopyToDataTable();
            }
            else
            {
                tb = tb.AsEnumerable().Where(x => (Convert.ToInt32(x["KHACH_HANG"]) == khachhang || khachhang == -1) && Convert.ToInt32(x["VTRO"]) == vaitro).CopyToDataTable();
            }

            if (CoAll == 1)
            {
                tb.Rows.Add("-1", " < ALL > ",1,-1);
            }
            else
            {
                tb.Rows.Add("-1", "", 1, -1);
            }
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_NGUOI_NHAP"),
                 Value = x.Field<string>("MS_NGUOI_NHAP")
             }).OrderBy(x => x.Text);
            return new SelectList(listItem.Distinct(), "Value", "Text", null);
        }

        public SelectList GetCbbNguoiXuat(string Username, int NNgu, int CoAll, int khachhang, int vaitro)
        {
            DataTable tb = new DataTable();

            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "SP_Y_GET_NGUOI_XUAT_KHOT_KHO", Username));
            if (vaitro == -1)
            {

                tb = tb.AsEnumerable().Where(x => Convert.ToInt32(x["VTRO"]) == vaitro).CopyToDataTable();
            }
            else
            {
                tb = tb.AsEnumerable().Where(x => (Convert.ToInt32(x["KHACH_HANG"]) == khachhang || khachhang == -1) && Convert.ToInt32(x["VTRO"]) == vaitro).CopyToDataTable();
            }

            if (CoAll == 1)
            {
                tb.Rows.Add("-1", " < ALL > ", 1, -1);
            }
            else
            {
                tb.Rows.Add("-1", "", 1, -1);
            }
            var listItem = tb.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_NGUOI_NHAP"),
                 Value = x.Field<string>("MS_NGUOI_NHAP")
             }).OrderBy(x => x.Text);
            return new SelectList(listItem.Distinct(), "Value", "Text", null);
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
        public SelectList GetCbbMay(string DD, int DC, string Username, int NNgu, int CoAll)
        {
            DataTable tb = new DataTable();
            tb.Load(SqlHelper.ExecuteReader(_dapper.GetDbconnection().ConnectionString, "SP_Y_GET_MAY_WEB", Username, NNgu, "-1", DD, DC, "-1", "-1", "-1"));
            if (CoAll == 1)
            {
                tb.Rows.Add("-1", " < ALL > ", "-1");
            }
            else
            {
                tb.Rows.Add("-1", "", "-1");
            }
            tb.DefaultView.Sort = "TEN_MAY";
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

        public IEnumerable<PriorityCategoryViewModel> GetPriorityCategory(int NN)
        {
            try
            {
                var res = _dapper.GetAll<PriorityCategoryViewModel>("H_YEU_CAU_NSD_MUC_UU_TIEN", null, System.Data.CommandType.StoredProcedure);

                return res ?? new List<PriorityCategoryViewModel>();
            }
            catch (Exception ex)
            {
                return new List<PriorityCategoryViewModel>();
            }
        }
        // Đạt sửa 10101999
        public SelectList GetCbbBoPhan(string msmay, string Username, int NNgu, int CoAll)
        {
            DataTable dtTmp = new DataTable();
            SqlCommand sqlcom = new SqlCommand();
            SqlConnection con = new SqlConnection(_dapper.GetDbconnection().ConnectionString);
            if (con.State == ConnectionState.Closed)
                con.Open();
            sqlcom.Connection = con;
            sqlcom.Parameters.AddWithValue("@sDanhMuc", "HISTORY");
            sqlcom.Parameters.AddWithValue("@UserName", Username);
            sqlcom.Parameters.AddWithValue("@iLoai", 0);
            sqlcom.Parameters.AddWithValue("@CoAll", CoAll);
            sqlcom.Parameters.AddWithValue("@NNgu", NNgu);
            sqlcom.Parameters.AddWithValue("@deviceID", msmay);
            sqlcom.CommandType = CommandType.StoredProcedure;
            sqlcom.CommandText = "spCMMSWEB";
            SqlDataAdapter da = new SqlDataAdapter(sqlcom);
            da.Fill(dtTmp);

            var listItem = dtTmp.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_BP"),
                 Value = x.Field<string>("MA_BP")
             });
            return new SelectList(listItem, "Value", "Text", null);
        }

        public SelectList GetCbbPhuTung(string msmay, string msbp, string Username, int NNgu, int CoAll)
        {
            DataTable dtTmp = new DataTable();
            SqlCommand sqlcom = new SqlCommand();
            SqlConnection con = new SqlConnection(_dapper.GetDbconnection().ConnectionString);
            if (con.State == ConnectionState.Closed)
                con.Open();
            sqlcom.Connection = con;
            sqlcom.Parameters.AddWithValue("@sDanhMuc", "HISTORY");
            sqlcom.Parameters.AddWithValue("@UserName", Username);
            sqlcom.Parameters.AddWithValue("@iLoai", 1);
            sqlcom.Parameters.AddWithValue("@NNgu", NNgu);
            sqlcom.Parameters.AddWithValue("@CoAll", CoAll);
            sqlcom.Parameters.AddWithValue("@deviceID", msmay);
            sqlcom.Parameters.AddWithValue("@sCot1", msbp == null ? "-1" : msbp);

            sqlcom.CommandType = CommandType.StoredProcedure;
            sqlcom.CommandText = "spCMMSWEB";
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
            sqlcom.Parameters.AddWithValue("@UserName", Username);
            sqlcom.Parameters.AddWithValue("@iLoai", 0);
            sqlcom.Parameters.AddWithValue("@NNgu", NNgu);
            sqlcom.Parameters.AddWithValue("@CoAll", CoAll);
            sqlcom.CommandType = CommandType.StoredProcedure;
            sqlcom.CommandText = "spCMMSWEB";
            SqlDataAdapter da = new SqlDataAdapter(sqlcom);
            da.Fill(dtTmp);

            var listItem = dtTmp.AsEnumerable().Select(
             x => new SelectListItem
             {
                 Text = x.Field<string>("TEN_NYC"),
                 Value = x.Field<string>("ID_NYC").ToString()
             });
            return new SelectList(listItem, "Value", "Text", null);
        }

    }
}
