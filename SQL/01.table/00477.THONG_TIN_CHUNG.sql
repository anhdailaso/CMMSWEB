if not exists(select * from sys.columns 
            where Name = N'KHOA_PBT' and Object_ID = Object_ID(N'THONG_TIN_CHUNG'))
begin
    ALTER TABLE dbo.THONG_TIN_CHUNG ADD KHOA_PBT bigint
END    
GO
if not exists(select * from sys.columns 
            where Name = N'AVATAR' and Object_ID = Object_ID(N'USERS'))
begin
    ALTER TABLE dbo.USERS ADD AVATAR IMAGE
END    

if not exists(select * from sys.columns 
            where Name = N'HT_MAY_CV' and Object_ID = Object_ID(N'NHOM'))
begin
    ALTER TABLE dbo.NHOM ADD  HT_MAY_CV BIT
END    

if not exists(select * from sys.columns 
            where Name = N'LUU_FILE' and Object_ID = Object_ID(N'THONG_TIN_CHUNG'))
begin
    ALTER TABLE dbo.THONG_TIN_CHUNG ADD LUU_FILE INT
END 
---1 là file share,2 là ftp
if not exists(select * from sys.columns 
            where Name = N'USER_FTP' and Object_ID = Object_ID(N'THONG_TIN_CHUNG'))
begin
    ALTER TABLE dbo.THONG_TIN_CHUNG ADD USER_FTP NVARCHAR(50)
END 
---1 là file share,2 là ftp
if not exists(select * from sys.columns 
            where Name = N'PASS_FTP' and Object_ID = Object_ID(N'THONG_TIN_CHUNG'))
begin
    ALTER TABLE dbo.THONG_TIN_CHUNG ADD PASS_FTP NVARCHAR(50)
END 
if not exists(select * from sys.columns 
            where Name = N'PORT_FTP' and Object_ID = Object_ID(N'THONG_TIN_CHUNG'))
begin
    ALTER TABLE dbo.THONG_TIN_CHUNG ADD PORT_FTP INT
END 

if not exists(select * from sys.columns 
            where Name = N'HOST_FTP' and Object_ID = Object_ID(N'THONG_TIN_CHUNG'))
begin
    ALTER TABLE dbo.THONG_TIN_CHUNG ADD HOST_FTP NVARCHAR(50)
END 

if not exists(select * from sys.columns 
            where Name = N'MUC_UU_TIEN' and Object_ID = Object_ID(N'GIAM_SAT_TINH_TRANG'))
begin
    ALTER TABLE dbo.GIAM_SAT_TINH_TRANG ADD MUC_UU_TIEN INT
END 

if not exists(select * from sys.columns 
            where Name = N'DOI_SP' and Object_ID = Object_ID(N'CAU_TRUC_THIET_BI_TS_GSTT'))
begin
    ALTER TABLE dbo.CAU_TRUC_THIET_BI_TS_GSTT ADD DOI_SP BIT
END 

if not exists(select * from sys.columns 
            where Name = N'PATH_IMAGE' and Object_ID = Object_ID(N'PHIEU_BAO_TRI_CONG_VIEC'))
begin
    ALTER TABLE dbo.PHIEU_BAO_TRI_CONG_VIEC ADD PATH_IMAGE NVARCHAR(500)
END 


