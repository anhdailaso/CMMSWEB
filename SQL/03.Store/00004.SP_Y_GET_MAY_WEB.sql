IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SP_Y_GET_MAY_WEB')
   exec('CREATE PROCEDURE SP_Y_GET_MAY_WEB AS BEGIN SET NOCOUNT ON; END')
GO
ALTER procedure [dbo].[SP_Y_GET_MAY_WEB] 
	@USERNAME NVARCHAR (64), 
	@LANGUAGE INT , 
	@MS_LOAI_MAY NVARCHAR (20),
	@MS_NHA_XUONG NVARCHAR(50),
	@MS_HE_THONG INT,
	@MS_TINH NVARCHAR(100),
	@MS_QUAN NVARCHAR(100),
	@MS_DUONG NVARCHAR(100)  
AS

DECLARE @NgayHT DATETIME
SET @NgayHT = GETDATE()
SELECT MS_N_XUONG , MS_MAY,MS_NHOM_MAY, TEN_MAY into #MAY FROM [dbo].[MGetMayUserNgay]( @NgayHT,@USERNAME,@MS_NHA_XUONG,@MS_HE_THONG,-1,@MS_LOAI_MAY,'-1','-1',@LANGUAGE)

	
SELECT TEMP.MS_MAY,TEMP.MS_MAY AS TEN_MAY, TEMP.MS_MAY AS MS_MAY1
FROM
(
	SELECT DISTINCT MS_MAY,TEN_MAY,MS_TINH=[dbo].[Get_CityCode](T2.MS_QG),MS_QUAN = T2.MS_QG,T2.MS_DUONG
	FROM     #MAY  T1 INNER JOIN NHA_XUONG T2 ON T1.MS_N_XUONG = T2.MS_N_XUONG
)TEMP WHERE (TEMP.MS_TINH= @MS_TINH   OR @MS_TINH = '-1')
	AND (TEMP.MS_QUAN = @MS_QUAN    OR @MS_QUAN = '-1')
	AND (TEMP.MS_DUONG = @MS_DUONG    OR @MS_DUONG = '-1')
	
ORDER BY TEMP.MS_MAY
GO

