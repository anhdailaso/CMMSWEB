if not exists(select * from sys.columns 
            where Name = N'NGAY_DUYET' and Object_ID = Object_ID(N'YCTD_VI_TRI_TUYEN'))
BEGIN
    ALTER TABLE dbo.YCTD_VI_TRI_TUYEN ADD NGAY_DUYET DATE
END   

