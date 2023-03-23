 if not exists(select * from sys.columns 
           where Name = N'MAC_DINH' and Object_ID = Object_ID(N'NHOM_KHO'))
begin
ALTER TABLE dbo.NHOM_KHO ADD MAC_DINH BIT END  
