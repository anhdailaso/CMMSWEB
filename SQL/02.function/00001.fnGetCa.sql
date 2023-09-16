
CREATE function [dbo].[fnGetCa]
(
	@Ngay DATETIME ='2021-12-13 14:00:00.001'
)
returns INT
as 
begin
declare @Resulst INT
	
	DECLARE @GIO_HT DATETIME = CONVERT (DATETIME , '01/01/1900 ' + CONVERT (NVARCHAR (8),@Ngay, 108));
	DECLARE @SP INT  = DATEPART(HOUR,@GIO_HT) * 60 + DATEPART(MINUTE,@GIO_HT)
	--kiểm tra thời gian trong ca ngày
	IF (SELECT COUNT(*) FROM dbo.CA WHERE (@SP >= TU_PHUT AND @SP < DEN_PHUT) OR (CA_DEM = 1 AND (@SP + 1440) >= TU_PHUT AND (@SP + 1440) < DEN_PHUT)) =1
		BEGIN
			SET @Resulst  = (SELECT TOP 1 STT FROM dbo.CA WHERE (@SP >= TU_PHUT AND @SP < DEN_PHUT) OR  (CA_DEM = 1 AND (@SP + 1440) >= TU_PHUT AND (@SP + 1440) < DEN_PHUT))
		END
	ELSE
        BEGIN
			--- nếu không có nằm tròng khoản nào thì lấy ca kế tiếp
			SET @Resulst =( SELECT STT FROM dbo.CA WHERE TU_GIO =(SELECT MIN(TU_GIO) FROM dbo.CA WHERE TU_GIO > @GIO_HT))
		END
return @Resulst
end

