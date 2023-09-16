if not exists(select * from sys.columns 
            where Name = N'GHI_CHU' and Object_ID = Object_ID(N'PHIEU_BAO_TRI'))
BEGIN
    ALTER TABLE dbo.PHIEU_BAO_TRI ADD GHI_CHU NVARCHAR(500)
END   
GO
 if not exists(select * from sys.columns 
           where Name = N'MAC_DINH' and Object_ID = Object_ID(N'NHOM_KHO'))
begin
ALTER TABLE dbo.NHOM_KHO ADD MAC_DINH BIT END  
