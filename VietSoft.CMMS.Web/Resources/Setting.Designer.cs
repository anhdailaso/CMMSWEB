﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace VietSoft.CMMS.Web.Resources {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class Setting {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Setting() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("VietSoft.CMMS.Web.Resources.Setting", typeof(Setting).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to dd/MM/yyyy.
        /// </summary>
        public static string FORMAT_DATE {
            get {
                return ResourceManager.GetString("FORMAT_DATE", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to dd/MM/yyyy HH:mm.
        /// </summary>
        public static string FORMAT_DATETIME {
            get {
                return ResourceManager.GetString("FORMAT_DATETIME", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Thông báo từ Duy Minh HRM.
        /// </summary>
        public static string MAIL_FROM {
            get {
                return ResourceManager.GetString("MAIL_FROM", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to [Duy Minh HRM] - Quên Mật Khẩu.
        /// </summary>
        public static string MAIL_SUBJECT {
            get {
                return ResourceManager.GetString("MAIL_SUBJECT", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to /images/icons/{0}.
        /// </summary>
        public static string MENU_ICON_FOLDER {
            get {
                return ResourceManager.GetString("MENU_ICON_FOLDER", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to MailTemplate/CreateNewPasswordTemplate.html.
        /// </summary>
        public static string TEMPLATE_CREATE_NEW_PASS {
            get {
                return ResourceManager.GetString("TEMPLATE_CREATE_NEW_PASS", resourceCulture);
            }
        }
    }
}
