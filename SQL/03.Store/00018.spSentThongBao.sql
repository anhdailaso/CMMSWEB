
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spSentThongBao')
   exec('CREATE PROCEDURE spSentThongBao AS BEGIN SET NOCOUNT ON; END')
GO

ALTER PROCEDURE [dbo].[spSentThongBao]
	@ID BIGINT = 144,
	@UName NVARCHAR(50) = 'Admin',
	@TableName NVARCHAR(50) = 'NGUOI_DUOC_GIAO_BAO_TRI',
	@sCot1 NVARCHAR(50) ='WO-202305000006',
	@sCot2 NVARCHAR(50) ='',
	@sCot3 NVARCHAR(50) =''
AS
BEGIN
DECLARE @sBody NVARCHAR(MAX) = ''
DECLARE @sSDT NVARCHAR(500) = ''

DECLARE @sLink NVARCHAR(50) ='https://27.74.240.29:1002/Home/'

IF NOT EXISTS(SELECT * FROM dbo.THONG_BAO_SU_KIEN T1 INNER JOIN dbo.THONG_BAO_SU_KIEN_NGUOI_NHAN T2 ON T2.ID_SU_KIEN = T1.ID_SU_KIEN 
--WHERE T1.TABLE_NAME = @TableName
)
BEGIN
	--SELECT -99 AS MA, N'Chưa định nghĩa thông báo gởi' AS [NAME]
	RETURN;
END
       SELECT TOP 0 D.SO_DTDD INTO #DTDD
	   FROM  dbo.THONG_BAO_SU_KIEN A
		INNER JOIN dbo.THONG_BAO_SU_KIEN_NGUOI_NHAN B ON B.ID_SU_KIEN = A.ID_SU_KIEN
		INNER JOIN dbo.USERS C ON C.USERNAME = B.USERNAME 
		INNER JOIN dbo.CONG_NHAN D ON D.MS_CONG_NHAN = C.MS_CONG_NHAN
--Thông Báo cho người tiếp nhận để duyệt yêu cầu
IF @TableName = 'YEU_CAU_NSD'
BEGIN 
	    SET @sBody = (SELECT TOP 1 N' '+ A.NGUOI_YEU_CAU +N' thông báo máy '+ B.MS_MAY +N' gặp vấn đề '+ B.MO_TA_TINH_TRANG +N' \n Máy hỏng từ '+ CONVERT(NVARCHAR(5),DATEPART(HOUR, B.GIO_XAY_RA)) +'g'+ CONVERT(NVARCHAR(5), DATEPART(MINUTE, B.GIO_XAY_RA)) +' '+ CONVERT(NVARCHAR(10),B.NGAY_XAY_RA,103) +'.' FROM dbo.YEU_CAU_NSD A 
		INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.STT = A.STT WHERE B.STT = @ID)

		--lấy số của user tạo vào số của người tiếp nhận cùng phòng bang với người tạo
		INSERT INTO #DTDD
		(
		    SO_DTDD
		)
		SELECT DISTINCT B.SO_DTDD FROM dbo.USERS A
		INNER JOIN dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN
		INNER JOIN dbo.TO_PHONG_BAN C ON C.MS_TO = A.MS_TO
		INNER JOIN dbo.USER_CHUC_NANG D ON D.USERNAME = A.USERNAME
		WHERE C.MS_TO = (SELECT MS_TO FROM dbo.USERS WHERE USERNAME = (SELECT USER_LAP FROM dbo.YEU_CAU_NSD WHERE STT = @ID)) AND D.STT = 14

END
--Thông báo cho người được giao
IF @TableName = 'NGUOI_DUOC_GIAO_BAO_TRI'
BEGIN 
	    SET @sBody = (SELECT TOP 1 N'Bạn được giao giải quyết sự cố máy '+ B.MS_MAY +' ('+ (SELECT TOP 1 TEN_MAY FROM dbo.MAY WHERE MS_MAY = B.MS_MAY) +N'). Máy bị hỏng từ '+ CONVERT(NVARCHAR(5),DATEPART(HOUR, B.GIO_XAY_RA)) +'g'+ CONVERT(NVARCHAR(5), DATEPART(MINUTE, B.GIO_XAY_RA)) +' '+ CONVERT(NVARCHAR(10),B.NGAY_XAY_RA,103) +N'.\nTruy cập link:'+ @sLink +'Account/Login?returnUrl=/Home/WorkOrderLink?mspbt='+SO_PHIEU_BAO_TRI+'*msmay='+A.MS_MAY+'' FROM dbo.PHIEU_BAO_TRI A
		LEFT JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON A.MS_PHIEU_BAO_TRI = B.MS_PBT WHERE A.MS_PHIEU_BAO_TRI = @sCot1)

		INSERT INTO #DTDD
		(
		    SO_DTDD
		)
		SELECT B.SO_DTDD FROM dbo.USERS A
		INNER JOIN dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN WHERE A.USERNAME = @UName

END
--Người được giao vào thì thông báo cho người có trách nhiệm
IF @TableName = 'NGUOI_CO_TRACH_NHIEM'
BEGIN 
		SET @sCot2 = (SELECT B.HO +' ' + B.TEN FROM dbo.USERS A INNER JOIN  dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN WHERE A.USERNAME = @UName)
		SET @sCot3 =  (SELECT MS_MAY +' ('+ TEN_MAY FROM dbo.MAY WHERE MS_MAY = (SELECT MS_MAY FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1)) +')'
	    SET @sBody = (SELECT @sCot2 + N' đã xem Phiếu bảo trì cho máy '+ @sCot3 +'')

		---người cách trách nhiệm là người tạo
		INSERT INTO #DTDD
		(
		    SO_DTDD
		)
		SELECT B.SO_DTDD FROM dbo.USERS A
		INNER JOIN dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN WHERE A.USERNAME = (SELECT USERNAME_NGUOI_LAP FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1)

END
--phiếu bảo trì quá hạn hoành thành thì báo cho người có trách nhiệm
IF @TableName = 'PHIEU_BAO_TRI_QUA_HAN_HOAN_THANH'
BEGIN 
	    SET @sBody = (SELECT N'Phiếu bảo trì: '+ @sCot1 +' cho máy '+@sCot2+N' đã quá thời hạn ('+ @sCot3 +N') mà vẫn chưa hoàn thành. Bạn vui lòng kiểm tra.')

		INSERT INTO #DTDD
		(
		    SO_DTDD
		)
		SELECT B.SO_DTDD FROM dbo.USERS A
		INNER JOIN dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN WHERE A.USERNAME = (SELECT USERNAME_NGUOI_LAP FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1)
END
--Phiếu bảo trì hoành thành cũng báo cho người có trách nhiệm
IF @TableName = 'PHIEU_BAO_TRI_HOAN_THANH'
BEGIN 
		SET @sCot2 =  (SELECT TOP 1 MS_MAY +' '+ TEN_MAY FROM dbo.MAY WHERE MS_MAY = (SELECT MS_MAY FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1))
	    SET @sBody = (SELECT N'Phiếu bảo trì cho máy '+@sCot2+N' đã hoàn thành.' FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1)

		INSERT INTO #DTDD
		(
		    SO_DTDD
		)
		SELECT B.SO_DTDD FROM dbo.USERS A
		INNER JOIN dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN WHERE A.USERNAME = (SELECT USERNAME_NGUOI_LAP FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1)
END
IF LTRIM(RTRIM(ISNULL(@sBody,''))) = '' 
BEGIN
	--SELECT -97 AS MA, N'Không có dữ liệu gởi' AS [NAME]
	RETURN;
END

--EXEC spSentMail
BEGIN TRY	

	SET @sSDT =  (SELECT STUFF((SELECT DISTINCT ';' + SO_DTDD FROM #DTDD
	FOR XML PATH(''), TYPE).value('.', 'nvarchar(max)'), 1, 1, ''))


DECLARE @start INT = 1, @end INT, @substring NVARCHAR(MAX)
WHILE @start <= LEN(@sSDT)
BEGIN
    SET @end = CHARINDEX(';', @sSDT, @start)
    IF @end = 0
        SET @end = LEN(@sSDT) + 1
    SET @substring = SUBSTRING(@sSDT, @start, @end - @start)
	BEGIN
		 --EXEC dbo.SendZalo @uID = @substring,-- nvarchar(100)
		 --@textMessage = @sBody -- nvarchar(max)
		 EXEC dbo.spSendMessage @iLoai = -1,         -- int
		                        @sMessage = @sBody,    -- nvarchar(max)
		                        @mRecipient = @substring,  -- nvarchar(500)
		                        @sID_TEMPLATE = N'' -- nvarchar(50)
		 
	END
    SET @start = @end + 1
END
	--SELECT 1 AS MA, N'Gởi thông báo thành công' AS [NAME];

END TRY
BEGIN CATCH  
		--SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME];
END CATCH;  	
END
GO

