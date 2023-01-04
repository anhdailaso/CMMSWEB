if not exists(select * from sys.columns 
            where Name = N'ImageGS' and Object_ID = Object_ID(N'GIAM_SAT_TINH_TRANG_TS'))
BEGIN
    ALTER TABLE dbo.GIAM_SAT_TINH_TRANG_TS ADD ImageGS IMAGE
END   

