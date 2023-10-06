public interface IFtpService
{
    void UploadFile(string localFilePath, string remoteDirectory, string remoteFileName);
    List<string> UploadMultipleFiles(IList<IFormFile> files, string remoteDirectory);
    string UploadFiles(IFormFile file, string remoteDirectory);
    void DownloadFile(string remoteFilePath, string localDirectory, string localFileName);
    string DownloadFileAsBase64(string remoteFilePath);
    byte[] DownloadFileAsBytes(string remoteFilePath);
    void DeleteFile(string remoteFilePath);
    void CreateDirectory(string remoteDirectory);
    void DeleteDirectory(string remoteDirectory);
}
