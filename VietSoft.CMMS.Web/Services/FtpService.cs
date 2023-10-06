using System.Net;
using FluentFTP; // Thêm namespace cho thư viện FluentFTP
using VietSoft.CMMS.Web.Helpers;

public class FtpService : IFtpService
{
    private readonly string ftpServer;
    private readonly NetworkCredential credentials;
    private readonly int port;

    public FtpService()
    {
        //ftpServer = "115.79.29.70";
        //string username = "Administrator";
        //string password = "VietSoft!@#$0924";
        //port = 21;
        ftpServer = SessionManager.ThongTinChung.HOST_FTP;
        string username = SessionManager.ThongTinChung.USER_FTP;
        string password = MaHoamd5.MaHoamd5.Decrypt(SessionManager.ThongTinChung.PASS_FTP, true);
        port = SessionManager.ThongTinChung.PORT_FTP;
        this.credentials = new NetworkCredential(username, password);
    }

    public void UploadFile(string localFilePath, string remoteDirectory, string remoteFileName)
    {
        using (var ftpClient = new FtpClient(ftpServer, credentials, port))
        {
            ftpClient.Connect();
            ftpClient.UploadFile(localFilePath, Path.Combine(remoteDirectory, remoteFileName));
            ftpClient.Disconnect();
        }
    }
    public List<string> UploadMultipleFiles(IList<IFormFile> files, string remoteDirectory)
    {
        var resulst = new List<string>();
        try
        {
            if (ftpServer != "")
            {
                using (var ftpClient = new FtpClient(ftpServer, credentials, port))
                {
                    ftpClient.Connect();
                    if (ftpClient.DirectoryExists(remoteDirectory))
                    {
                        ftpClient.DeleteDirectory(remoteDirectory, FtpListOption.AllFiles);
                    }
                    ftpClient.CreateDirectory(remoteDirectory);
                    foreach (var file in files)
                    {
                        using (var stream = file.OpenReadStream())
                        {
                            // Tạo một tệp trung gian từ Stream
                            var tempFilePath = Path.GetTempFileName();
                            using (var tempFileStream = File.Create(tempFilePath))
                            {
                                stream.CopyTo(tempFileStream);
                            }
                            //Tải lên tệp trung gian
                            var remoteFilePath = Path.Combine(remoteDirectory, DateTime.Now.ToString("yyyyMMdd_HHmmssff") + LayDuoiFile(file.FileName));
                            ftpClient.UploadFile(tempFilePath, remoteFilePath);
                            resulst.Add(remoteFilePath);
                            // Xóa tệp trung gian
                            File.Delete(tempFilePath);
                        }
                    }
                    ftpClient.Disconnect();
                }
            }
            return resulst;
        }

        catch (Exception ex)
        {
            return null;
        }
    }

    public string UploadFiles(IFormFile file, string remoteDirectory)
    {
        string resulst = "";
        try
        {
            if (ftpServer != "")
            {
                using (var ftpClient = new FtpClient(ftpServer, credentials, port))
                {
                    ftpClient.Connect();
                    if (ftpClient.DirectoryExists(remoteDirectory))
                    {
                        ftpClient.DeleteDirectory(remoteDirectory, FtpListOption.AllFiles);
                    }
                    ftpClient.CreateDirectory(remoteDirectory);
                    using (var stream = file.OpenReadStream())
                    {
                        // Tạo một tệp trung gian từ Stream
                        var tempFilePath = Path.GetTempFileName();
                        using (var tempFileStream = File.Create(tempFilePath))
                        {
                            stream.CopyTo(tempFileStream);
                        }
                        //Tải lên tệp trung gian
                        var remoteFilePath = Path.Combine(remoteDirectory, DateTime.Now.ToString("yyyyMMdd_HHmmssff") + LayDuoiFile(file.FileName));
                        ftpClient.UploadFile(tempFilePath, remoteFilePath);
                        resulst = remoteFilePath;
                        // Xóa tệp trung gian
                        File.Delete(tempFilePath);
                    }
                    ftpClient.Disconnect();
                }
            }
            return resulst;
        }
        catch (Exception ex)
        {
            return "";
        }
    }

    public void DownloadFile(string remoteFilePath, string localDirectory, string localFileName)
    {
        if (ftpServer != "")
        {
            using (var ftpClient = new FtpClient(ftpServer, credentials, port))
            {
                ftpClient.Connect();
                ftpClient.DownloadFile(Path.Combine(localDirectory, localFileName), remoteFilePath);
                ftpClient.Disconnect();
            }
        }
    }
    public string DownloadFileAsBase64(string remoteFilePath)
    {
        string resulst = "";
        if (ftpServer != "")
        {
            using (var ftpClient = new FtpClient(ftpServer, credentials, port))
            {
                ftpClient.Connect();
                try
                {
                    // Đường dẫn tới tệp trên máy cục bộ để lưu trữ
                    string localFilePath = Path.GetTempFileName();
                    // Tải tệp từ máy chủ FTP xuống máy cục bộ
                    ftpClient.DownloadFile(localFilePath, remoteFilePath);
                    // Đọc tệp từ máy cục bộ và chuyển đổi thành chuỗi Base64
                    byte[] fileBytes = File.ReadAllBytes(localFilePath);
                    string base64String = Convert.ToBase64String(fileBytes);
                    // Xóa tệp tạm thời trên máy cục bộ
                    File.Delete(localFilePath);
                    resulst = base64String;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                    resulst = "";
                }
                finally
                {
                    ftpClient.Disconnect();
                }
            }
        }
        return resulst;
    }

    public byte[] DownloadFileAsBytes(string remoteFilePath)
    {
        byte[] resulst = null;
        if (ftpServer != "")
        {
            using (var ftpClient = new FtpClient(ftpServer, credentials, port))
            {
                ftpClient.Connect();
                try
                {
                    // Đường dẫn tới tệp trên máy cục bộ để lưu trữ
                    string localFilePath = Path.GetTempFileName();
                    // Tải tệp từ máy chủ FTP xuống máy cục bộ
                    ftpClient.DownloadFile(localFilePath, remoteFilePath);
                    // Đọc tệp từ máy cục bộ và chuyển đổi thành chuỗi Base64
                    resulst = File.ReadAllBytes(localFilePath);
                    // Xóa tệp tạm thời trên máy cục bộ
                    File.Delete(localFilePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                    resulst = null;
                }
                finally
                {
                    ftpClient.Disconnect();
                }
            }
        }
        return resulst;
    }

    public void DeleteFile(string remoteFilePath)
    {
        if (ftpServer != "")
        {
            using (var ftpClient = new FtpClient(ftpServer, credentials, port))
            {
                ftpClient.Connect();
                ftpClient.DeleteFile(remoteFilePath);
                ftpClient.Disconnect();
            }
        }
    }
    public void CreateDirectory(string remoteDirectory)
    {
        if (ftpServer != "")
        {
            using (var ftpClient = new FtpClient(ftpServer, credentials, port))
            {
                ftpClient.Connect();
                // Kiểm tra xem thư mục đã tồn tại hay chưa
                if (!ftpClient.DirectoryExists(remoteDirectory))
                {
                    ftpClient.CreateDirectory(remoteDirectory);
                }
                ftpClient.Disconnect();
            }
        }
    }
    public void DeleteDirectory(string remoteDirectory)
    {
        if (ftpServer != "")
        {
            using (var ftpClient = new FtpClient(ftpServer, credentials, port))
            {
                ftpClient.Connect();
                ftpClient.DeleteDirectory(remoteDirectory, FtpListOption.AllFiles);
                ftpClient.Disconnect();
            }
        }
    }

    public string LayDuoiFile(string strFile)
    {
        string[] FILE_NAMEArr, arr;
        string FILE_NAME = "";
        string str = "";
        FILE_NAMEArr = strFile.Split(@"\");
        FILE_NAME = FILE_NAMEArr[FILE_NAMEArr.Length - 1];
        arr = FILE_NAME.Split(".");
        return "." + arr[arr.Length - 1];
    }
}
