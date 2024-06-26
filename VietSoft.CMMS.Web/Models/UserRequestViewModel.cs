﻿using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
    public class UserRequestViewModel
    {
        public Int64 STT { get; set; }
        public string MS_MAY { get; set; }
        public string MS_YEU_CAU { get; set; }
        [Required(ErrorMessageResourceType = typeof(Message), ErrorMessageResourceName = "FIELD_REQUIRED")]
        public string MO_TA_TINH_TRANG { get; set; }
        [Required(ErrorMessageResourceType = typeof(Message), ErrorMessageResourceName = "FIELD_REQUIRED")]
        public string YEU_CAU { get; set; }
        public int MS_UU_TIEN { get; set; }
        public int MS_NGUYEN_NHAN { get; set; }
        public DateTime? NGAY { get; set; }
        public DateTime? NGAY_XAY_RA { get; set; }
        public string NGAY_XAY_RA_STR { get; set; }
        public DateTime? GIO_YEU_CAU { get; set; }
        public string NGUOI_YEU_CAU { get; set; }
        public int DUYET { get; set; }
        public bool HONG { get; set; }
        public string Files { get; set; }
        public List<ImageFiles> ListImage { get; set; }
        public string? USERNAME { get; set; }
        public int QUYEN { get; set; }
    }

    public class AcceptUserRequest
    {
        public Int64 STT { get; set; }
        public string MS_MAY { get; set; }
        public int LOAI { get; set; }
        public string TEN_MAY { get; set; }
        [Required(ErrorMessageResourceType = typeof(Message), ErrorMessageResourceName = "FIELD_REQUIRED")]
        public string GHI_CHU { get; set; }

    }
    public class ImageFiles 
    {
        public string DUONG_DAN { get; set; }
    }
}
