if not exists(select * from sys.columns 
            where Name = N'GHI_CHU' and Object_ID = Object_ID(N'PHIEU_BAO_TRI'))
BEGIN
    ALTER TABLE dbo.PHIEU_BAO_TRI ADD GHI_CHU NVARCHAR(500)
END   

