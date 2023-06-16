

--EXEC spSendMessage @iLoai = -1 ,@sMessage = 'Send Zalo',@mRecipient = '0866054222'
--EXEC spSendMessage @iLoai = 1 ,@sMessage = 'Có', @mRecipient = N'84866054222'
--EXEC spSendMessage @iLoai = 1 ,@sMessage = N'Send Tele Via Phone or ID ', @mRecipient = N'SendTest'
---EXEC spSendMessage @iLoai = 2 ,@sMessage = N'"TEN_MAY": "Máy tính 001","MO_TA_TT": "Không khởi động được máy","NGUOI_DUNG": "Nguyễn Viên","MS_MAY": "001","TG_MAY_HONG": "05/07/2023"', @mRecipient = N'84385519902' , @sID_TEMPLATE = N'258508'
---EXEC spSendMessage @iLoai = 10
----SELECT * FROM dbo.ACCESS_TOKEN
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spSendMessage')
   exec('CREATE PROCEDURE spSendMessage AS BEGIN SET NOCOUNT ON; END')
GO

ALTER PROCEDURE [dbo].[spSendMessage]
	@iLoai INT = 1,
	@sMessage NVARCHAR(MAX) = '',
    @mRecipient NVARCHAR(500)= '',
	@sID_TEMPLATE NVARCHAR(50) = ''-- bao gồm Name or Chat group name  or @username  nhận
AS
BEGIN
--- iLoai = -1 là goi theo thông tin Chung
	IF @iLoai = -1 
	BEGIN
		SET @iloai = (SELECT TOP 1 LOAI_GUI FROM dbo.THONG_TIN_CHUNG)    
	END
	-- Link API
	DECLARE @API NVARCHAR(MAX)
	SELECT @API = API FROM dbo.ACCESS_TOKEN WHERE ID_TOKEN = @iLoai

	-- Id APP --- Zalo  ID TÀI KHOẢNG OA  --- TELE APP-ID
	DECLARE @mAppId NVARCHAR(1000)


	-- Id APP --- Zalo  MẬT KHẨU TÀI KHOẢNG OA  --- TELE API HASH
	DECLARE @mApiHash NVARCHAR(1000)
	-- Định nghĩa zalo 
	DECLARE @ResponseText AS VARCHAR(8000);

	DECLARE @access_token NVARCHAR(MAX) = (SELECT AccessToken FROM dbo.ACCESS_TOKEN WHERE ID_TOKEN = 0);

	DECLARE @refresh_token NVARCHAR(MAX) = (SELECT RefreshToken FROM dbo.ACCESS_TOKEN WHERE ID_TOKEN = 0);

	DECLARE @Object AS INT;

	DECLARE @json_payload NVARCHAR(MAX)

	DECLARE @params NVARCHAR(MAX)
	
	--- Send zalo 
	IF  @iLoai = 0
	BEGIN
		DECLARE @url_Zalo NVARCHAR(MAX) = @API + 'message/cs'
		SET @json_payload  = N'{
			"recipient": {
			"user_id": "' + @mRecipient + '"
			},
			"message": {
			"text": "' + @sMessage + '"
			}
		}';
		EXEC sp_OACreate 'MSXML2.XMLHTTP', @Object OUT;
		EXEC sp_OAMethod @Object, 'open', NULL, 'POST',@url_Zalo,'false'
		EXEC sp_OAMethod @Object, 'setRequestHeader', NULL, 'Content-Type', 'application/json'
		EXEC sp_OAMethod @Object, 'setRequestHeader', NULL, 'access_token', @access_token
		EXEC sp_OAMethod @Object, 'setRequestHeader', NULL, 'message', @sMessage
		EXEC sp_OAMethod @Object, 'send', NULL, @json_payload
		EXEC sp_OAMethod @Object, 'send'
		EXEC sp_OAMethod @Object, 'responseText', @ResponseText OUTPUT

		--SELECT error AS ERR_ID,  message AS ERR_NAME
		--FROM OPENJSON(@ResponseText)
		--WITH (
		--	error INT,
		--	message NVARCHAR(MAX)
		--);
	END

	--- Send Tele
	IF @iLoai = 1
	BEGIN
	-- Định nghĩa telegram    mTeleSend?mRecipient=84983188199&msg=Test%20moi
		SET @params = @API + 'mTeleSend?mRecipient=' + CONCAT('84',RIGHT(@mRecipient,9))  + '&msg=N' + @sMessage	
		EXEC sp_OACreate 'MSXML2.XMLHTTP', @Object OUT;
		EXEC sp_OAMethod @Object, 'open', NULL, 'GET', @params, 'false'
		EXEC sp_OAMethod @Object, 'send'
		EXEC sp_OAMethod @Object, 'responseText', @ResponseText OUTPUT

		
		--IF UPPER(LEFT(@ResponseText,6)) = '"ERROR'
		--BEGIN
		--    SELECT	1 AS ID_ERR, REPLACE(REPLACE(@ResponseText,'"ERROR ',''),'"','') AS ERR_NAME
		--END
		--ELSE
		--BEGIN
		--    SELECT	0 AS ID_ERR, REPLACE(@ResponseText,'"','') AS ERR_NAME
		--END
			

	END

	--- Send Zalo ZNS
	IF @iLoai = 2
	BEGIN
	    SET @json_payload  = N'{
			"phone": "'+ @mRecipient +'",
			"template_id": "'+@sID_TEMPLATE+'",
			"template_data": {
				'+ @sMessage +'
			 },
			"tracking_id":"tracking_id"
		}';
		EXEC sp_OACreate 'MSXML2.XMLHTTP', @Object OUT;
		--Mặc định API 
		EXEC sp_OAMethod @Object, 'open', NULL, 'POST','https://business.openapi.zalo.me/message/template','false'
		EXEC sp_OAMethod @Object, 'setRequestHeader', NULL, 'access_token', @access_token
		EXEC sp_OAMethod @Object, 'send', NULL, @json_payload
		EXEC sp_OAMethod @Object, 'send'
		EXEC sp_OAMethod @Object, 'responseText', @ResponseText OUTPUT

		--SELECT error AS ERR_ID, message AS ERR_NAME
		--FROM OPENJSON(@ResponseText)
		--WITH (
		--	error INT,
		--	message NVARCHAR(MAX)
		--);
	END

	IF @iLoai = 10 
	BEGIN
	    SET @mAppId = (SELECT TOP 1 AppID FROM dbo.ACCESS_TOKEN WHERE ID_TOKEN = 0);
		SET @mApiHash = (SELECT TOP 1 SecretKey FROM dbo.ACCESS_TOKEN WHERE ID_TOKEN = 0);

		EXEC sp_OACreate 'MSXML2.XMLHTTP', @Object OUT;
		EXEC sp_OAMethod @Object, 'open', NULL, 'POST', 'https://oauth.zaloapp.com/v4/oa/access_token', 'false'
		EXEC sp_OAMethod @Object, 'setRequestHeader', NULL, 'Content-Type', 'application/x-www-form-urlencoded'
		EXEC sp_OAMethod @Object, 'setRequestHeader', NULL, 'secret_key', @mApiHash
		EXEC sp_OAMethod @Object, 'send', NULL, @params
		EXEC sp_OAMethod @Object, 'responseText', @ResponseText OUTPUT

		---EXEC spSendMessage @iLoai = 10
		SELECT access_token,
		   refresh_token,
		   expires_in 
		FROM OPENJSON(@ResponseText)
		WITH (
			access_token NVARCHAR(MAX),
			refresh_token NVARCHAR(MAX),
			expires_in INT
		);


		UPDATE dbo.ACCESS_TOKEN
		SET AccessToken = BT.access_token,
		RefreshToken = BT.refresh_token,
		TimeRefresh = GETDATE()
		FROM (
			SELECT access_token,
				   refresh_token,
				   expires_in 
			FROM OPENJSON(@ResponseText)
			WITH (
				access_token NVARCHAR(MAX),
				refresh_token NVARCHAR(MAX),
				expires_in INT
			)
		) BT 
		WHERE ID_TOKEN = 0
	END
END

GO

