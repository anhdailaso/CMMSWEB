
ALTER PROCEDURE [dbo].[spCMMSWEB]
	@sDanhMuc NVARCHAR(500) = N'GetUserRequest',
	@DNgay DATE = '2023/03/15',
	@UserName NVARCHAR(255) = 'Admin',
	@MsNXuong nvarchar(50) = '-1',
	@NNgu INT = 1,
	@bcot1 BIT = 1,
	@icot1 INT = 0,
	@icot2 INT = 1,
	@icot3 INT = 100,
	@iLoai INT = 1,
	@CoAll INT = 0,
	@fcot1 FLOAT = '-1',
	@sCot1 NVARCHAR(500) = '-1',
	@sCot2 NVARCHAR(500) = '01',
	@sCot3 NVARCHAR(500) = '',
	@MS_BP INT = 14,
	@dCot1 DATETIME = '02/07/2022',
	@dCot2 DATETIME = '02/07/2024',
	@json NVARCHAR(MAX) = N'["\\\\192.168.1.6\\TaiLieu\\Hinh_May\\BAF-1001\\13_3_2023\\YCNSD_BAF-1001_1332023_1.jpg"]',
	@deviceID NVARCHAR(50) ='AIC-0006',
	@isDue INT = 1,
    @stt INT = -1
	--,
	--@TotalRows INT = NULL OUTPUT
AS 
BEGIN
IF(@sDanhMuc = 'GET_MYECOMAINT')
BEGIN

SELECT DISTINCT MS_MAY,TEN_MAY INTO #MAY_USER FROM [dbo].[MGetMayUserNgay](@DNgay,@UserName,@MsNXuong,-1,-1,@sCot1,'-1',-1,@NNgu)



SELECT DISTINCT T1.MS_MAY,T2.TEN_MAY,CASE WHEN CONVERT(DATE,MAX(T1.NGAY_KT_KH)) < CONVERT(DATE,GETDATE()) THEN	1 ELSE 0 END TREBT,MIN(T1.MS_UU_TIEN) AS MUC_BT  
INTO #PBT FROM dbo.PHIEU_BAO_TRI T1 INNER JOIN #MAY_USER T2 ON T1.MS_MAY = T2.MS_MAY 
WHERE (CONVERT(DATE, NGAY_BD_KH) BETWEEN DATEADD(YEAR,-1,@DNgay) AND CONVERT(DATE,@DNgay)) AND (TINH_TRANG_PBT =2) 
GROUP BY T1.MS_MAY,T2.TEN_MAY

SELECT DISTINCT MS_MAY,TEN_MAY,CASE WHEN CONVERT(DATE,MAX(NGAY_KE)) < CONVERT(DATE,GETDATE()) THEN	1 ELSE 0 END TREGS, 0 AS MUC_GS 
INTO #GSTT FROM [dbo].[MGetHieuChuanKeGSTT](DATEADD(YEAR,-1,@DNgay),@DNgay,@UserName,@MsNXuong,-1,-1,@sCot1,'-1',-1,1,@NNgu) T1
GROUP BY MS_MAY,TEN_MAY

--IF EXISTS(SELECT * FROM dbo.USER_CHUC_NANG WHERE STT = 14 AND USERNAME =@UserName)
--BEGIN
--SET @sCot3 = NULL;
--END
--ELSE
--BEGIN
--SET @sCot3 = '0';
--END

SELECT DISTINCT B.MS_MAY,C.TEN_MAY,A.NGAY,0 AS TREYC, B.MS_UU_TIEN AS MUC_YC INTO #YC FROM  dbo.YEU_CAU_NSD A
INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.STT = A.STT 
INNER JOIN #MAY_USER C ON C.MS_MAY = B.MS_MAY 
WHERE  (CONVERT(DATE,A.NGAY) BETWEEN DATEADD(YEAR,-1,GETDATE()) AND CONVERT(DATE,GETDATE())) AND (B.USERNAME_DSX IS NULL OR B.USERNAME_DBT IS NULL)

SELECT DISTINCT T1.MS_MAY,T1.TEN_MAY,
CASE WHEN ISNULL(T4.MS_MAY,'') = '' THEN 0 ELSE 1 END AS YC,
CASE WHEN ISNULL(T2.MS_MAY,'') = '' THEN 0 ELSE 1 END AS PBT,
CASE WHEN ISNULL(T3.MS_MAY,'') = '' THEN 0 ELSE 1 END AS GSTT,
T4.TREYC,
T2.TREBT,
T3.TREGS,
T4.MUC_YC,T2.MUC_BT,T3.MUC_GS
INTO #DSECOMAINT
FROM (
	SELECT MS_MAY,TEN_MAY FROM #GSTT 
	UNION SELECT MS_MAY,TEN_MAY FROM #PBT
	UNION SELECT MS_MAY,TEN_MAY FROM #YC
) T1 
LEFT JOIN  #PBT T2 ON T1.MS_MAY = T2.MS_MAY 
LEFT JOIN #GSTT T3 ON T1.MS_MAY = T3.MS_MAY 
LEFT JOIN #YC T4 ON T1.MS_MAY = T4.MS_MAY
 --WHERE T1.MS_MAY = @deviceID OR @deviceID ='-1'
 IF(@bcot1 = 1)
 BEGIN
 SELECT CN.MS_MAY,
        CN.TEN_MAY,
        CN.YC,
        CN.PBT,
        CN.GSTT,
      ISNULL(CN.TREYC,0) TREYC,
              ISNULL(CN.TREBT,0)  TREBT,
              ISNULL(CN.TREGS,0)   TREGS,CN.MUC_YC,CN.MUC_BT,CN.MUC_GS FROM #DSECOMAINT CN order by CN.MS_MAY
 END
 ELSE
 BEGIN
 ---lấy thêm những mấy chưa có
 SELECT T.MS_MAY,
        T.TEN_MAY,
        T.YC,
        T.PBT,
        T.GSTT, 
		ISNULL(TREYC,0) TREYC,
              ISNULL(TREBT,0)  TREBT,
              ISNULL(TREGS,0)   TREGS FROM (
		SELECT MS_MAY,
               TEN_MAY,
               YC,
               PBT,
               GSTT,
               TREYC,
               TREBT,
               TREGS,MUC_YC,MUC_BT,MUC_GS FROM #DSECOMAINT
		UNION
	SELECT A.MS_MAY,A.TEN_MAY,NULL,NULL,NULL,NULL,NULL,NULL FROM #MAY_USER A WHERE NOT EXISTS (SELECT * FROM #DSECOMAINT B WHERE A.MS_MAY = B.MS_MAY)
	 ) AS  T  ORDER BY T.MS_MAY
 END
END
IF(@sDanhMuc = 'MORNINGTORING')
BEGIN
		SELECT B.MS_LOAI_CV INTO #LCV FROM dbo.USERS A
	INNER JOIN dbo.NHOM_LOAI_CONG_VIEC B ON B.GROUP_ID = A.GROUP_ID WHERE A.USERNAME = @UserName
--sữa thì update những cái đã có vào
        SELECT  T1.MS_MAY ,
                T1.MS_BO_PHAN ,
                T1.MS_TS_GSTT ,
                T2.TEN_GIA_TRI ,
                T1.GHI_CHU ,
                T1.STT_GT,
				T1.MS_TT
        INTO    #TEMPT1
        FROM    dbo.GIAM_SAT_TINH_TRANG_TS_DT T1
                LEFT JOIN dbo.GIA_TRI_TS_GSTT T2 ON T2.MS_TS_GSTT = T1.MS_TS_GSTT
                                                    AND T1.STT_GT = T2.STT
        WHERE   T1.STT = @stt
                AND T1.MS_MAY = @deviceID
        ORDER BY T1.MS_MAY

        IF (@isDue = 0)
            BEGIN
			--định tínhssf	
                SELECT  DISTINCT
                        @deviceID DeviceID ,
                        THONG_SO_GSTT.TEN_TS_GSTT MonitoringParamsName ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT MonitoringParamsID ,
                        T.MS_BO_PHAN ComponentID ,
                        T.TEN_BO_PHAN ComponentName ,
                        THONG_SO_GSTT.LOAI_TS TypeOfParam ,
                        '' MeasurementUnitName ,
                        GIA_TRI_TS_GSTT.TEN_GIA_TRI ValueParamName ,
                        GIA_TRI_TS_GSTT.DAT Pass ,
                        CONVERT(FLOAT, 0) Measurement ,
                        GIA_TRI_TS_GSTT.STT ValueParamID ,
                        '' Note,
						PATH_HD AS DUONG_DAN
                INTO    #TEMPTA
                FROM    THONG_SO_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI_TS_GSTT ON CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT = THONG_SO_GSTT.MS_TS_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI T ON T.MS_MAY = CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY
                                                          AND T.MS_BO_PHAN = CAU_TRUC_THIET_BI_TS_GSTT.MS_BO_PHAN
                        LEFT JOIN GIA_TRI_TS_GSTT ON THONG_SO_GSTT.MS_TS_GSTT = GIA_TRI_TS_GSTT.MS_TS_GSTT
                WHERE   ( CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY = @deviceID )
                        AND THONG_SO_GSTT.LOAI_TS = 1
                       AND ACTIVE = 1
							AND MS_LOAI_CV IN (SELECT MS_LOAI_CV FROM #LCV)
                UNION
	--định lượng
                SELECT DISTINCT
                        @deviceID DeviceID ,
                        THONG_SO_GSTT.TEN_TS_GSTT MonitoringParamsName ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT MonitoringParamsID ,
                        T.MS_BO_PHAN ComponentID ,
                        T.TEN_BO_PHAN ComponentName ,
                        THONG_SO_GSTT.LOAI_TS TypeOfParam ,
                        ISNULL(T4.TEN_DV_DO, '') MeasurementUnitName ,
                        dbo.GetGiaTriThongSo(@deviceID, T.MS_BO_PHAN,
                                             CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT) ValueParamName ,
                        -1 Pass ,
                        CONVERT(FLOAT,null) as Measurement ,
                        -1 ValueParamID ,
                        '' Note,
						PATH_HD AS DUONG_DAN
                FROM    THONG_SO_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI_TS_GSTT ON CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT = THONG_SO_GSTT.MS_TS_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI T ON T.MS_MAY = CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY
                                                          AND T.MS_BO_PHAN = CAU_TRUC_THIET_BI_TS_GSTT.MS_BO_PHAN
                        LEFT JOIN dbo.DON_VI_DO AS T4 ON THONG_SO_GSTT.MS_DV_DO = T4.MS_DV_DO
                WHERE   ( CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY = @deviceID )
                        AND THONG_SO_GSTT.LOAI_TS = 0
                        AND ACTIVE = 1 AND  MS_LOAI_CV IN (SELECT MS_LOAI_CV FROM #LCV)
                GROUP BY THONG_SO_GSTT.TEN_TS_GSTT ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT ,
                        T.MS_BO_PHAN ,
                        T.TEN_BO_PHAN ,
                        THONG_SO_GSTT.LOAI_TS ,
                        TEN_DV_DO ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TT,PATH_HD

                IF @stt = -1 -- thêm thì lấy mới
                    BEGIN
                        SELECT  DeviceID,
                                MonitoringParamsName,
                                MonitoringParamsID,
                                ComponentID,
                                ComponentName,
                                TypeOfParam,
                                MeasurementUnitName,
                                ValueParamName,
                                Pass,
                               Measurement,
                                ValueParamID,
                                Note,
								DUONG_DAN
                        FROM    #TEMPTA A ORDER BY TypeOfParam DESC, ComponentID

						SELECT 1
                    END
                ELSE
				--sữa thì update cái đã có vào cái mới
                    BEGIN
					-- update định tính
                        UPDATE  #TEMPTA
                        SET     Measurement = 1
                        WHERE   EXISTS ( SELECT *
                                         FROM   #TEMPT1
                                         WHERE  MS_MAY = #TEMPTA.DeviceID
                                                AND MS_BO_PHAN = #TEMPTA.ComponentID
                                                AND MS_TS_GSTT = #TEMPTA.MonitoringParamsID
                                                AND STT_GT = #TEMPTA.ValueParamID) AND TypeOfParam = 1

						-- update định Lượng
						
						UPDATE a
						SET a.Measurement = b.GIA_TRI_DO
						FROM #TEMPTA a
						INNER JOIN dbo.GIAM_SAT_TINH_TRANG_TS b ON a.DeviceID = b.MS_MAY AND ComponentID = b.MS_BO_PHAN AND MonitoringParamsID = b.MS_TS_GSTT 
						WHERE   b.STT =@stt AND a.TypeOfParam = 0


                        SELECT  A.DeviceID,
                                A.MonitoringParamsName,
                                A.MonitoringParamsID,
                                A.ComponentID,
                                A.ComponentName,
                                A.TypeOfParam,
                                A.MeasurementUnitName,
                                A.ValueParamName,
                                A.Pass,
                                A.Measurement,
                                A.ValueParamID,
                                A.Note,A.DUONG_DAN
                                INTO #RESULST FROM #TEMPTA A

					SELECT DeviceID,
                           MonitoringParamsName,
                           MonitoringParamsID,
                           ComponentID,
                           ComponentName,
                           TypeOfParam,
                           MeasurementUnitName,
                           ValueParamName,
                           Pass,
                           Measurement,
                           ValueParamID,
                           Note,
                           A.DUONG_DAN FROM #RESULST A ORDER BY TypeOfParam DESC, ComponentID
                    END
            END
        ELSE
		-- lấy theo thời gian đến hạn kiểm tra
            BEGIN

			SELECT DISTINCT  T1.MS_MAY, T1.TEN_TS_GSTT, T1.MS_BO_PHAN , T1.MS_TS_GSTT INTO #GS  FROM [dbo].[MGetHieuChuanKeGSTT]('01/01/2020',GETDATE(),'admin','-1',-1,-1,'-1','-1',-1,0,0) T1 


                SELECT DISTINCT
                        @deviceID DeviceID ,
                        THONG_SO_GSTT.TEN_TS_GSTT MonitoringParamsName ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT MonitoringParamsID ,
                        T.MS_BO_PHAN ComponentID ,
                        T.TEN_BO_PHAN ComponentName ,
                        THONG_SO_GSTT.LOAI_TS TypeOfParam ,
                        '' MeasurementUnitName ,
                        GIA_TRI_TS_GSTT.TEN_GIA_TRI ValueParamName ,
                        GIA_TRI_TS_GSTT.DAT Pass ,
                        CONVERT(FLOAT, 0) Measurement ,
                        GIA_TRI_TS_GSTT.STT ValueParamID ,
                        '' Note,PATH_HD as DUONG_DAN
                INTO    #TEMPTB1
                FROM    THONG_SO_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI_TS_GSTT ON CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT = THONG_SO_GSTT.MS_TS_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI T ON T.MS_MAY = CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY
                                                          AND T.MS_BO_PHAN = CAU_TRUC_THIET_BI_TS_GSTT.MS_BO_PHAN
														  INNER JOIN #GS GS ON GS.MS_MAY = T.MS_MAY AND GS.MS_BO_PHAN = T.MS_BO_PHAN AND GS.MS_TS_GSTT = THONG_SO_GSTT.MS_TS_GSTT
                        LEFT JOIN GIA_TRI_TS_GSTT ON THONG_SO_GSTT.MS_TS_GSTT = GIA_TRI_TS_GSTT.MS_TS_GSTT
                      
                WHERE   ( CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY = @deviceID )
                        AND THONG_SO_GSTT.LOAI_TS = 1
                        AND ACTIVE = 1
							AND MS_LOAI_CV IN (SELECT MS_LOAI_CV FROM #LCV)
				SELECT DeviceID,
                       MonitoringParamsName,
                       MonitoringParamsID,
                       ComponentID,
                       ComponentName,
                       TypeOfParam,
                       MeasurementUnitName,
                       ValueParamName,
                       Pass,
                       Measurement,
                       ValueParamID,
                       Note,DUONG_DAN INTO #TEMPTB
					   FROM #TEMPTB1
				UNION
			   SELECT DISTINCT
                        @deviceID DeviceID ,
                        THONG_SO_GSTT.TEN_TS_GSTT MonitoringParamsName ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT MonitoringParamsID ,
                        T.MS_BO_PHAN ComponentID ,
                        T.TEN_BO_PHAN ComponentName ,
                        THONG_SO_GSTT.LOAI_TS TypeOfParam ,
                        ISNULL(T4.TEN_DV_DO, '') MeasurementUnitName ,
                        dbo.GetGiaTriThongSo(@deviceID, T.MS_BO_PHAN,CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT) ValueParamName ,
                        -1 Pass ,
                        CONVERT(FLOAT,null) as Measurement ,
                        -1 ValueParamID ,
                        '' Note,PATH_HD as DUONG_DAN
                FROM    THONG_SO_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI_TS_GSTT ON CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT = THONG_SO_GSTT.MS_TS_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI T ON T.MS_MAY = CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY
                                                          AND T.MS_BO_PHAN = CAU_TRUC_THIET_BI_TS_GSTT.MS_BO_PHAN
						INNER JOIN #GS GS ON GS.MS_TS_GSTT = THONG_SO_GSTT.MS_TS_GSTT AND GS.MS_BO_PHAN = T.MS_BO_PHAN AND GS.MS_MAY = T.MS_MAY
                        LEFT JOIN dbo.DON_VI_DO AS T4 ON THONG_SO_GSTT.MS_DV_DO = T4.MS_DV_DO
					
                WHERE   ( CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY = @deviceID )
                        AND THONG_SO_GSTT.LOAI_TS = 0
                        AND ACTIVE = 1 AND MS_LOAI_CV IN (SELECT MS_LOAI_CV FROM #LCV)
                GROUP BY THONG_SO_GSTT.TEN_TS_GSTT ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT ,
                        T.MS_BO_PHAN ,
                        T.TEN_BO_PHAN ,
                        THONG_SO_GSTT.LOAI_TS ,
                        TEN_DV_DO ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TT,PATH_HD
						--[GetMonitoringParametersByDevice]
                IF @stt = -1 -- thêm thì lấy mới
                    BEGIN
                        SELECT  DeviceID,
                                MonitoringParamsName,
                                MonitoringParamsID,
                                ComponentID,
                                ComponentName,
                                TypeOfParam,
                                MeasurementUnitName,
                                ValueParamName,
                                Pass,
                                Measurement,
                                ValueParamID,
                                DUONG_DAN
                        FROM    #TEMPTB A
                    END
                ELSE
                    BEGIN
                        UPDATE  #TEMPTB
                        SET     Measurement = 1
                        WHERE   EXISTS (SELECT *
                                         FROM   #TEMPT1
                                         WHERE  MS_MAY = #TEMPTB.DeviceID
                                                AND MS_BO_PHAN = #TEMPTB.ComponentID
                                                AND MS_TS_GSTT = #TEMPTB.MonitoringParamsID
                                                AND STT_GT = #TEMPTB.ValueParamID )
                    END
            END
	
END
IF(@sDanhMuc ='SAVE_MONINGTORING')
BEGIN
		BEGIN TRANSACTION UpGSTT
		BEGIN TRY

	SELECT DISTINCT DeviceID, MonitoringParamsID, ComponentID,TypeOfParam,ValueParamID,ID,Measurement,Note,DUONG_DAN INTO #BTGS FROM OPENJSON(@json) 
	WITH (DeviceID NVARCHAR(30) '$.DeviceID',	MonitoringParamsID NVARCHAR(10) '$.MonitoringParamsID', ComponentID NVARCHAR(50) '$.ComponentID',
	TypeOfParam BIT '$.TypeOfParam',ValueParamID INT '$.ValueParamID',ID INT '$.ID',Measurement FLOAT '$.Measurement', Note NVARCHAR(250) '$.Note', DUONG_DAN NVARCHAR(250) '$.DUONG_DAN');
	INSERT INTO dbo.GIAM_SAT_TINH_TRANG
	(
	    NGAY_KT,
	    GIO_KT,
	    DEN_GIO,
	    MS_CONG_NHAN,
	    GIO_CHAY_MAY,
	    NHAN_XET,
	    USERNAME,
	    SO_PHIEU,
	    NGAY_KH,
	    HOAN_THANH,
	    NGAY_KT_GOC,
	    TONG_GIO
	)
	VALUES
	(   CONVERT(DATETIME,	 CONVERT(NVARCHAR(10),GETDATE(),101)), -- NGAY_KT - datetime
	   CONVERT(DATETIME,	 CONVERT(NVARCHAR(8),GETDATE(),108)), -- GIO_KT - datetime
	    CONVERT(DATETIME,	 CONVERT(NVARCHAR(8),GETDATE(),108)), -- DEN_GIO - datetime
	    (SELECT MS_CONG_NHAN FROM dbo.USERS WHERE USERNAME ='ADMIN'),       -- MS_CONG_NHAN - nvarchar(9)
	    0.0,       -- GIO_CHAY_MAY - float
	    N'',       -- NHAN_XET - nvarchar(255)
	    @UserName,       -- USERNAME - nvarchar(255)
	    (select dbo.AUTO_CREATE_SO_PHIEU_GSTT(GETDATE())),       -- SO_PHIEU - nvarchar(50)
	    CONVERT(DATETIME,	 CONVERT(NVARCHAR(10),GETDATE(),101)), -- NGAY_KH - datetime
	    0,         -- HOAN_THANH - int
	    CONVERT(DATETIME,	 CONVERT(NVARCHAR(10),GETDATE(),101)), -- NGAY_KT_GOC - datetime
	    0.0        -- TONG_GIO - float
	    )
		SET @stt = SCOPE_IDENTITY()

	    INSERT INTO dbo.GIAM_SAT_TINH_TRANG_TS( STT ,MS_MAY ,MS_TS_GSTT ,MS_BO_PHAN ,MS_TT,GHI_CHU ,THOI_GIAN ,TG_TT,GIA_TRI_DO)
		SELECT DISTINCT @stt,DeviceID,MonitoringParamsID ,ComponentID ,ID ,Note  ,B.THOI_GIAN,B.THOI_GIAN,Measurement  FROM #BTGS A
		INNER JOIN dbo.CAU_TRUC_THIET_BI_TS_GSTT B ON A.DeviceID = B.MS_MAY AND A.MonitoringParamsID =B.MS_TS_GSTT AND A.ComponentID = B.MS_BO_PHAN AND A.ID = B.MS_TT
		WHERE A.ID > 0
	
		INSERT INTO dbo.GIAM_SAT_TINH_TRANG_TS_DT( STT ,MS_MAY ,MS_TS_GSTT ,MS_BO_PHAN ,MS_TT ,STT_GT,GHI_CHU)
		SELECT DISTINCT @stt,DeviceID,MonitoringParamsID ,ComponentID ,ID,ValueParamID, Note FROM #BTGS WHERE TypeOfParam = 1
		
		UPDATE A 
		SET A.NGAY_GS_CUOI = GETDATE()
		FROM dbo.CAU_TRUC_THIET_BI_TS_GSTT A
		INNER JOIN #BTGS B ON  B.DeviceID = A.MS_MAY AND B.MonitoringParamsID =A.MS_TS_GSTT AND B.ComponentID = A.MS_BO_PHAN
		WHERE B.ID > 0

		INSERT INTO dbo.GIAM_SAT_TINH_TRANG_HINH
		(STT,MS_MAY,MS_TS_GSTT,MS_BO_PHAN,MS_TT,DUONG_DAN,GHI_CHU)
		SELECT DISTINCT @stt,DeviceID,MonitoringParamsID ,ComponentID ,ID,DUONG_DAN, Note FROM #BTGS 
		COMMIT TRANSACTION UpGSTT

		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]


		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION UpGSTT;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END
IF(@sDanhMuc ='GETPROFILE')
BEGIN
SELECT TOP 1 A.USERNAME AS UserName,D.HO + ' '+D.TEN  AS FullName,B.TEN_TO AS Department,C.GROUP_NAME AS [Group],A.USER_MAIL AS  Email   FROM dbo.USERS A
LEFT JOIN dbo.[TO] B ON B.MS_TO = A.MS_TO
LEFT JOIN  dbo.NHOM C ON C.GROUP_ID = A.GROUP_ID
LEFT JOIN dbo.CONG_NHAN D ON D.MS_CONG_NHAN = A.MS_CONG_NHAN
WHERE A.USERNAME = @UserName
END
IF(@sDanhMuc ='GENERAL')
BEGIN

DECLARE @TEN_TO NVARCHAR(50) =''
DECLARE @TEN_DV NVARCHAR(50) =''
DECLARE @HO_TEN NVARCHAR(50) =''

SELECT @TEN_TO = B.TEN_TO,@TEN_DV = D.TEN_DON_VI ,@HO_TEN = (E.HO +' ' + E.TEN) FROM dbo.USERS A
INNER JOIN dbo.[TO] B ON B.MS_TO = A.MS_TO 
INNER JOIN dbo.TO_PHONG_BAN C ON C.MS_TO = B.MS_TO
INNER JOIN dbo.DON_VI D ON D.MS_DON_VI = C.MS_DON_VI
LEFT JOIN dbo.CONG_NHAN E ON E.MS_CONG_NHAN = A.MS_CONG_NHAN
WHERE A.USERNAME =@UserName


SELECT TEN_CTY_TIENG_VIET AS TEN_CTY,TEN_NGAN_TIENG_VIET AS TEN_NGAN,DIA_CHI_VIET AS  DIA_CHI,Phone AS PHONE,@username,Fax AS FAX 
,@TEN_TO AS TEN_TO,@TEN_DV AS TEN_DV  ,@HO_TEN AS HO_TEN,DUONG_DAN_TL
FROM dbo.THONG_TIN_CHUNG
END
IF(@sDanhMuc ='GetUserRequest')
BEGIN
---[spCMMSWEB]
	SELECT TOP 1 A.STT,B.MS_MAY,B.MO_TA_TINH_TRANG,B.YEU_CAU,B.MS_UU_TIEN,B.MS_NGUYEN_NHAN,A.NGAY,A.GIO_YEU_CAU,CASE WHEN B.THOI_GIAN_DSX IS NULL THEN 0 ELSE 1 END AS DUYET,
	CONVERT(NVARCHAR(5),A.GIO_YEU_CAU,108)  + ' ' + CONVERT(NVARCHAR(10),A.NGAY,105) + ' '+ A.NGUOI_YEU_CAU AS NGUOI_YEU_CAU,B.NGAY_XAY_RA,
	CASE ISNULL(B.NGAY_XAY_RA,'') WHEN '' THEN 0 ELSE 1 END AS HONG,
	(SELECT DUONG_DAN  FROM dbo.YEU_CAU_NSD_CHI_TIET_HINH  WHERE MS_MAY = @deviceID AND STT = (SELECT MAX(STT) FROM dbo.YEU_CAU_NSD_CHI_TIET_HINH WHERE MS_MAY = @deviceID)  FOR JSON AUTO ) AS Files,B.USERNAME
	INTO #GETYCNSD
	FROM dbo.YEU_CAU_NSD A
	INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.STT = A.STT WHERE B.MS_MAY =@deviceID AND (B.NGAY_DBT IS NULL OR B.THOI_GIAN_DSX IS NULL)
	ORDER BY A.GIO_YEU_CAU DESC

	SELECT STT,
           MS_MAY,
           MO_TA_TINH_TRANG,
           YEU_CAU,
           MS_UU_TIEN,
           MS_NGUYEN_NHAN,
           NGAY,
           GIO_YEU_CAU,
           DUYET,
           NGUOI_YEU_CAU,
           NGAY_XAY_RA,
           HONG,
           Files,
           USERNAME,
		   CASE DUYET WHEN 0 THEN (SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT = 13 AND USERNAME =@UserName) ELSE (SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT = 14 AND USERNAME =@UserName) END AS QUYEN	
		   FROM #GETYCNSD 	ORDER BY GIO_YEU_CAU DESC

END

IF(@sDanhMuc ='GetList_Image_UserRequest')
BEGIN
	SELECT DUONG_DAN  FROM dbo.YEU_CAU_NSD_CHI_TIET_HINH  WHERE MS_MAY = @deviceID AND STT = @icot1  FOR JSON AUTO
END
IF(@sDanhMuc ='SAVE_USEREQUEST')
BEGIN

		BEGIN TRANSACTION UpNSD
		BEGIN TRY
		--stt = -1 thi them moi
		if(@stt = -1)
		BEGIN
		INSERT INTO dbo.YEU_CAU_NSD
		(
		    NGAY,
		    GIO_YEU_CAU,
		    NGUOI_YEU_CAU,
		    USER_COMMENT,
		    NGAY_HOAN_THANH,
		    DA_KIEM_TRA,
		    USER_LAP,
		    EMAIL_NSD,
		    SO_YEU_CAU,
		    MS_YEU_CAU,
		    MS_N_XUONG
		)
		VALUES
		(   GETDATE(), -- NGAY - datetime
		    GETDATE(), -- GIO_YEU_CAU - datetime
		    @sCot3,       -- NGUOI_YEU_CAU - nvarchar(50)
		    N'',       -- USER_COMMENT - nvarchar(max)
		    GETDATE(), -- NGAY_HOAN_THANH - datetime
		    0,      -- DA_KIEM_TRA - bit
		    @UserName,       -- USER_LAP - nvarchar(30)
		    '',        -- EMAIL_NSD - varchar(500)
		    dbo.AUTO_CREATE_SO_PHIEU_YC(GETDATE()),       -- SO_YEU_CAU - nvarchar(250)
		    dbo.AUTO_CREATE_SO_PHIEU_YC(GETDATE()),       -- MS_YEU_CAU - nvarchar(50)
		    (SELECT TOP 1 MS_N_XUONG FROM dbo.MAY_NHA_XUONG WHERE MS_MAY =@deviceID)     -- MS_N_XUONG - nvarchar(50)
		    )
		SET @stt = SCOPE_IDENTITY()
		INSERT INTO dbo.YEU_CAU_NSD_CHI_TIET
		(
		    STT,
		    MS_MAY,
		    MO_TA_TINH_TRANG,
		    YEU_CAU,
		    MS_CACH_TH,
		    MS_PBT,
		    MS_CONG_NHAN,
		    USERNAME,
		    MS_UU_TIEN,
		    USERNAME_DSX,
		    THOI_GIAN_DSX,
		    Y_KIEN_DSX,
		    THUC_HIEN_DSX,
		    EMAIL_DSX,
		    USERNAME_DBT,
		    NGAY_DBT,
		    Y_KIEN_DBT,
		    EMAIL_DBT,
		    NGAY_XAY_RA,
		    GIO_XAY_RA,
		    MS_LOAI_YEU_CAU_BT,
		    MS_NGUYEN_NHAN
		)
		VALUES
		(   @stt,         -- STT - int
		    @deviceID,       -- MS_MAY - nvarchar(30)
		    @sCot1,       -- MO_TA_TINH_TRANG - nvarchar(max)
		    @sCot2,       -- YEU_CAU - nvarchar(max)
		    NULL,       -- MS_CACH_TH - nvarchar(15)
		    NULL,       -- MS_PBT - nvarchar(20)
		    NULL,       -- MS_CONG_NHAN - nvarchar(9)
		    @UserName,       -- USERNAME - nvarchar(50)
		    @icot2,         -- MS_UU_TIEN - int
		    NULL,       -- USERNAME_DSX - nvarchar(50)
		    NULL, -- THOI_GIAN_DSX - datetime
		    NULL,       -- Y_KIEN_DSX - nvarchar(250)
		    NULL,      -- THUC_HIEN_DSX - bit
		    NULL,       -- EMAIL_DSX - nvarchar(250)
		    NULL,       -- USERNAME_DBT - nvarchar(50)
		    NULL, -- NGAY_DBT - datetime
		    NULL,       -- Y_KIEN_DBT - nvarchar(250)
		    NULL,       -- EMAIL_DBT - nvarchar(250)
		    @dCot1, -- NGAY_XAY_RA - datetime
		    GETDATE(), -- GIO_XAY_RA - datetime
		    0,         -- MS_LOAI_YEU_CAU_BT - int
		    @icot3        -- MS_NGUYEN_NHAN - int
		    )
		DECLARE  @stt1 INT
			SET @stt1 = SCOPE_IDENTITY()

			SELECT DISTINCT DUONG_DAN INTO #BTHINH FROM OPENJSON(@json) 
			WITH (DUONG_DAN NVARCHAR(255) '$.DUONG_DAN');

			INSERT INTO dbo.YEU_CAU_NSD_CHI_TIET_HINH
			(
			    STT,
			    MS_MAY,
			    STT_VAN_DE,
			    DUONG_DAN
			)
			SELECT @stt,@deviceID,@stt1,DUONG_DAN  FROM #BTHINH

		--kiểm tra user có quyền duyệt hay không
		SET @icot1 =(SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT =  13 AND USERNAME = @UserName)
		--tự động duyệt khi hỏng đột xuất
		IF(@bcot1 = 1 OR @icot1 = 1)
			BEGIN
				UPDATE dbo.YEU_CAU_NSD_CHI_TIET
				SET USERNAME_DSX = @UserName,
				THOI_GIAN_DSX = GETDATE(),
				Y_KIEN_DSX = 'Auto',
				THUC_HIEN_DSX = 1
				WHERE STT =@stt AND MS_MAY = @deviceID
			END
		END
		ELSE
        BEGIN
			--update dữ liệu
			UPDATE dbo.YEU_CAU_NSD_CHI_TIET SET  MO_TA_TINH_TRANG =  @sCot1,       -- MO_TA_TINH_TRANG - nvarchar(max)
		    YEU_CAU = @sCot2,       -- YEU_CAU - nvarchar(max)
		    MS_UU_TIEN = @icot2,         -- MS_UU_TIEN - int
			 NGAY_XAY_RA = @dCot1, -- NGAY_XAY_RA - datetime
			 GIO_XAY_RA = @dCot1
			WHERE STT =@stt


		SET @icot1 =(SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT =  13 AND USERNAME = @UserName)
		--tự động duyệt khi hỏng đột xuất
		IF(@bcot1 = 1 OR @icot1 = 1)
			BEGIN
				UPDATE dbo.YEU_CAU_NSD_CHI_TIET
				SET USERNAME_DSX = @UserName,
				THOI_GIAN_DSX = GETDATE(),
				Y_KIEN_DSX = 'Auto',
				THUC_HIEN_DSX = 1
				WHERE STT =@stt AND MS_MAY = @deviceID
			END
		END

		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		COMMIT TRANSACTION UpNSD
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION UpNSD;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END


IF(@sDanhMuc ='DELETE_USEREQUEST')
BEGIN
		BEGIN TRANSACTION DeNSD
		BEGIN TRY
			--xoa yeu cau nguoi su dung
			DELETE	dbo.YEU_CAU_NSD_CHI_TIET_HINH WHERE STT = @stt
			DELETE	dbo.YEU_CAU_NSD_CHI_TIET WHERE STT = @stt
			DELETE	dbo.YEU_CAU_NSD WHERE STT = @stt

		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		COMMIT TRANSACTION DeNSD
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION DeNSD;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END

IF(@sDanhMuc = 'GET_WORDORDER')
BEGIN 
	IF(@bcot1 = 1)
	BEGIN
		SELECT TOP 1  MS_PHIEU_BAO_TRI,NGAY_KT_KH,MS_LOAI_BT,A.MS_UU_TIEN, B.MO_TA_TINH_TRANG AS N'TINH_TRANG_MAY'  FROM dbo.PHIEU_BAO_TRI A
		LEFT JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON A.MS_PHIEU_BAO_TRI = B.MS_PBT
		WHERE A.MS_MAY = @deviceID AND A.TINH_TRANG_PBT  = 2 ORDER BY MS_PHIEU_BAO_TRI DESC
	END
	ELSE
    BEGIN
		SELECT dbo.AUTO_CREATE_SO_PHIEU_BT(GETDATE()) MS_PHIEU_BAO_TRI,GETDATE() AS NGAY_KT_KH,NULL MS_LOAI_BT,NULL MS_UU_TIEN, NULL AS N'TINH_TRANG_MAY'
	END
END

IF(@sDanhMuc = 'GET_WORDORDER_BY_MSBT')
BEGIN 
	
		SELECT TOP 1  MS_PHIEU_BAO_TRI,NGAY_KT_KH,MS_LOAI_BT,A.MS_UU_TIEN, B.MO_TA_TINH_TRANG AS N'TINH_TRANG_MAY'  FROM dbo.PHIEU_BAO_TRI A
		LEFT JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON A.MS_PHIEU_BAO_TRI = B.MS_PBT
		WHERE A.MS_PHIEU_BAO_TRI = @sCot1
	
END


IF(@sDanhMuc ='SAVE_WORDORDER')
BEGIN
	BEGIN TRANSACTION UpPBT
	BEGIN TRY
		DECLARE @MS_YC NVARCHAR(50)
	IF(ISNULL(@sCot3,'') = '')
	BEGIN
		--update phieu yeu cau duyet bao tri
		SELECT TOP 1 @MS_YC =  A.MS_YEU_CAU ,@stt = A.STT FROM dbo.YEU_CAU_NSD A
		INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.STT = A.STT
		WHERE MS_MAY = @deviceID AND ISNULL(B.THOI_GIAN_DSX,'') !=''
		ORDER BY A.STT DESC

		UPDATE dbo.YEU_CAU_NSD_CHI_TIET SET NGAY_DBT = GETDATE(),USERNAME_DBT = @UserName,Y_KIEN_DBT = 'WEB',MS_PBT = @sCot1,MS_CACH_TH ='04' WHERE STT=@stt
	END
	

	--kiểm tra usert có quyền ban hành phiếu bảo trì không
	 SELECT @icot3 = COUNT(*) FROM dbo.USER_CHUC_NANG WHERE USERNAME = @UserName AND STT =  7

	DECLARE @MS_TT_CT INT
	SET @MS_TT_CT = NULL
	SELECT TOP 1 @MS_TT_CT = MS_TT_CT FROM TINH_TRANG_PBT_CT WHERE STT = (@icot3 + 1) AND MAC_DINH = 1
	INSERT INTO dbo.PHIEU_BAO_TRI(MS_PHIEU_BAO_TRI,TINH_TRANG_PBT,MS_MAY,MS_LOAI_BT,NGAY_LAP,GIO_LAP,LY_DO_BT,MS_UU_TIEN,NGAY_BD_KH,NGAY_KT_KH,NGUOI_LAP,USERNAME_NGUOI_LAP,SO_PHIEU_BAO_TRI,MS_TT_CT,UPDATE_NGAY_CUOI,STT_CA)
	VALUES(@sCot1,@icot3 + 1,@deviceID,@icot1,CONVERT(DATE,GETDATE()),GETDATE(),N'tạo từ web',@icot2,GETDATE(),@dCot1,(SELECT MS_CONG_NHAN FROM dbo.USERS WHERE USERNAME = @UserName),@UserName,@sCot1,@MS_TT_CT,GETDATE(),-1)

	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION UpPBT
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION UpPBT;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
END
IF(@sDanhMuc = 'GET_WORDORDER_DETAILS')
	BEGIN
		SELECT DISTINCT A.MS_PHIEU_BAO_TRI,A.MS_BO_PHAN,C.TEN_BO_PHAN,A.MS_CV,D.MO_TA_CV,B.MS_PT,E.TEN_PT,F.MS_VI_TRI_PT,B.SL_TT  
		FROM dbo.PHIEU_BAO_TRI_CONG_VIEC A
		LEFT JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI AND B.MS_CV = A.MS_CV AND B.MS_BO_PHAN = A.MS_BO_PHAN
		LEFT JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET F ON F.MS_PHIEU_BAO_TRI = B.MS_PHIEU_BAO_TRI AND F.MS_CV = B.MS_CV AND F.MS_PT = B.MS_PT AND F.MS_BO_PHAN = B.MS_BO_PHAN
		INNER JOIN dbo.CAU_TRUC_THIET_BI C ON C.MS_BO_PHAN = A.MS_BO_PHAN AND C.MS_MAY = @deviceID
		INNER JOIN dbo.CONG_VIEC D ON D.MS_CV = A.MS_CV
		LEFT JOIN dbo.IC_PHU_TUNG E ON E.MS_PT = B.MS_PT
		WHERE A.MS_PHIEU_BAO_TRI = @sCot1 AND C.MS_MAY = @deviceID
	END
IF(@sDanhMuc ='GET_LIST_JOB')
BEGIN
	SELECT A.MS_BO_PHAN,B.TEN_BO_PHAN,A.MS_CV,C.MO_TA_CV FROM dbo.CAU_TRUC_THIET_BI_CONG_VIEC A
	INNER JOIN dbo.CAU_TRUC_THIET_BI B ON B.MS_MAY = A.MS_MAY AND B.MS_BO_PHAN = A.MS_BO_PHAN
	INNER JOIN dbo.CONG_VIEC C ON C.MS_CV = A.MS_CV
	WHERE A.MS_MAY = @deviceID AND A.ACTIVE = 1 AND NOT EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC D WHERE D.MS_PHIEU_BAO_TRI =@sCot1 AND D.MS_CV = A.MS_CV AND D.MS_BO_PHAN = A.MS_BO_PHAN)
END
IF(@sDanhMuc ='SAVE_LIST_JOB')
BEGIN
	BEGIN TRANSACTION UpCONGVIEC
	BEGIN TRY

	SELECT DISTINCT MS_BO_PHAN,TEN_BO_PHAN,MS_CV,MO_TA_CV INTO #BTCV FROM OPENJSON(@json) 
	WITH (MS_BO_PHAN NVARCHAR(50) '$.MS_BO_PHAN',TEN_BO_PHAN NVARCHAR(250) '$.TEN_BO_PHAN', MS_CV INT '$.MS_CV', MO_TA_CV NVARCHAR(255) '$.MO_TA_CV');
	INSERT INTO dbo.PHIEU_BAO_TRI_CONG_VIEC(MS_PHIEU_BAO_TRI,MS_CV,MS_BO_PHAN,SO_GIO_KH,NGAY_HOAN_THANH,SO_GIO_PB,DINH_MUC_PB,H_THANH,DANH_GIA,PT_HOAN_THANH,NGAY_BDCV,NGAY_KTCV)
	SELECT @sCot1,A.MS_CV,A.MS_BO_PHAN,B.TG_KH,NULL,0,0,0,0,0,NULL,NULL FROM #BTCV A
	INNER JOIN (SELECT * FROM dbo.CAU_TRUC_THIET_BI_CONG_VIEC WHERE MS_MAY = @deviceID) B ON A.MS_BO_PHAN = B.MS_BO_PHAN AND A.MS_CV = B.MS_CV
	WHERE NOT EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC C WHERE C.MS_PHIEU_BAO_TRI = @sCot1 AND C.MS_BO_PHAN = A.MS_BO_PHAN AND C.MS_CV = A.MS_CV)
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]

	COMMIT TRANSACTION UpCONGVIEC
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION UpCONGVIEC;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
END
IF(@sDanhMuc ='GET_LIST_SPAREPART')
BEGIN
	SELECT A.MS_PT,B.TEN_PT,A.MS_VI_TRI_PT,SO_LUONG AS SL_KH   FROM dbo.CAU_TRUC_THIET_BI_PHU_TUNG A
	INNER JOIN dbo.IC_PHU_TUNG B ON B.MS_PT = A.MS_PT
	WHERE A.MS_MAY = @deviceID AND A.MS_BO_PHAN = @sCot2 AND A.ACTIVE = 1 AND NOT EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG C WHERE C.MS_PHIEU_BAO_TRI = @sCot1 AND C.MS_BO_PHAN = @sCot2 AND C.MS_PT = A.MS_PT)
	UNION
	SELECT D.MS_PT,E.TEN_PT,NULL AS MS_VI_TRI_PT ,1 AS SL_KT FROM dbo.MAY A
	INNER JOIN dbo.NHOM_MAY B ON B.MS_NHOM_MAY = A.MS_NHOM_MAY
	INNER JOIN  dbo.LOAI_MAY C ON C.MS_LOAI_MAY = B.MS_LOAI_MAY
	INNER JOIN dbo.IC_PHU_TUNG_LOAI_MAY D ON D.MS_LOAI_MAY = C.MS_LOAI_MAY
	INNER JOIN dbo.IC_PHU_TUNG E ON E.MS_PT = D.MS_PT
	WHERE MS_MAY = @deviceID AND E.ACTIVE_PT = 1 AND E.VAT_TU_PT = 1

END
IF(@sDanhMuc ='SAVE_LIST_SPAREPART')
--[spCMMSWEB]
BEGIN
		BEGIN TRANSACTION UpPhuTung
		BEGIN TRY

		SELECT DISTINCT MS_PT,TEN_PT,MS_VI_TRI_PT,SL_KH INTO #BTPT FROM OPENJSON(@json) 
		WITH (MS_PT NVARCHAR(25) '$.MS_PT',TEN_PT NVARCHAR(250) '$.TEN_PT',MS_VI_TRI_PT NVARCHAR(250) '$.MS_VI_TRI_PT', SL_KH FLOAT '$.SL_KH');
		
		--update lại số lượng thực tế với cái nào đã tồn tại
		UPDATE A
		SET A.SL_TT = B.SL_KH
		FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG A
		INNER JOIN #BTPT B ON A.MS_PHIEU_BAO_TRI = @sCot1 AND A.MS_BO_PHAN = @sCot2 AND A.MS_CV = @icot1 AND A.MS_PT =  B.MS_PT

		INSERT INTO dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG(MS_PHIEU_BAO_TRI,MS_CV,MS_BO_PHAN,MS_PT,SL_KH,SL_TT)
		SELECT @sCot1,@icot1,@sCot2,A.MS_PT,B.SO_LUONG,A.SL_KH FROM #BTPT A
		LEFT JOIN (SELECT * FROM dbo.CAU_TRUC_THIET_BI_PHU_TUNG WHERE MS_MAY = @deviceID AND MS_BO_PHAN = @sCot2)B ON A.MS_PT = B.MS_PT
		WHERE NOT EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG  C WHERE C.MS_PHIEU_BAO_TRI = @sCot1 AND C.MS_BO_PHAN = @sCot2 AND C.MS_CV = @icot1 AND C.MS_PT =  A.MS_PT)

		INSERT INTO dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET(MS_PHIEU_BAO_TRI,MS_CV,MS_BO_PHAN,MS_PT,MS_VI_TRI_PT,SL_KH,SL_TT,VICT_NHA_THAU,NGUOI_THAY_THE)
		SELECT @sCot1,@icot1,@sCot2,A.MS_PT,A.MS_VI_TRI_PT,B.SO_LUONG,A.SL_KH,0,(SELECT TOP 1 ISNULL(MS_CONG_NHAN,@UserName) FROM dbo.USERS WHERE USERNAME = @UserName) FROM #BTPT A
		INNER JOIN (SELECT * FROM dbo.CAU_TRUC_THIET_BI_PHU_TUNG WHERE MS_MAY = @deviceID AND MS_BO_PHAN = @sCot2)B ON A.MS_PT = B.MS_PT
		INNER JOIN dbo.IC_PHU_TUNG D ON D.MS_PT = B.MS_PT AND D.VAT_TU_PT = 0
		WHERE NOT EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET  C WHERE C.MS_PHIEU_BAO_TRI = @sCot1 AND C.MS_BO_PHAN = @sCot2 AND C.MS_CV = @icot1 AND C.MS_PT =  A.MS_PT) AND D.VAT_TU_PT = 0
		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]

		COMMIT TRANSACTION UpPhuTung
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION UpPhuTung;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END
IF(@sDanhMuc ='GET_LIST_WORKING_TIME')
BEGIN
	SELECT MS_CONG_NHAN,TU_GIO,NGAY,DEN_GIO,DEN_NGAY,SO_GIO  FROM dbo.PHIEU_BAO_TRI_NHAN_SU WHERE MS_PHIEU_BAO_TRI = @sCot1 AND MS_CONG_NHAN = (SELECT ISNULL(MS_CONG_NHAN,@UserName) FROM dbo.USERS WHERE USERNAME = @UserName)
END
IF(@sDanhMuc ='SAVE_LIST_WORKING_TIME')
BEGIN
		BEGIN TRANSACTION UpWoking
		BEGIN TRY

		SELECT DISTINCT MS_CONG_NHAN,TU_GIO,NGAY,DEN_GIO,DEN_NGAY,SO_GIO INTO #BTWOK FROM OPENJSON(@json) 
		WITH (MS_CONG_NHAN NVARCHAR(9) '$.MS_CONG_NHAN',TU_GIO DATETIME '$.TU_GIO',NGAY DATETIME '$.NGAY',DEN_GIO DATETIME '$.DEN_GIO', DEN_NGAY DATETIME '$.DEN_NGAY', SO_GIO FLOAT '$.SO_GIO');
		
		--update lại số lượng thực tế với cái nào đã tồn tại
		DELETE dbo.PHIEU_BAO_TRI_NHAN_SU where MS_PHIEU_BAO_TRI = @sCot1

		INSERT INTO dbo.PHIEU_BAO_TRI_NHAN_SU(MS_PHIEU_BAO_TRI,MS_CONG_NHAN,NGAY,TU_GIO,DEN_NGAY,DEN_GIO,HOAN_THANH,SO_GIO)	
		SELECT @sCot1,(SELECT TOP 1 ISNULL(MS_CONG_NHAN,@UserName) FROM dbo.USERS WHERE USERNAME = @UserName),NGAY,NGAY,DEN_NGAY,DEN_NGAY,0,SO_GIO FROM #BTWOK
	
		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		COMMIT TRANSACTION UpWoking
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION UpWoking;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END
IF(@sDanhMuc ='GET_LIST_FAILRULE_ANALYSIS')
BEGIN
	SELECT B.* INTO #CLASS FROM dbo.PHIEU_BAO_TRI A
	INNER JOIN dbo.PHIEU_BAO_TRI_CLASS B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI
	WHERE A.MS_MAY = @deviceID

	SELECT DISTINCT A.MS_MAY,A.MS_BO_PHAN,A.TEN_BO_PHAN,B.CLASS_ID,B.CLASS_CODE,B.CLASS_NAME,(SELECT COUNT(*) FROM #CLASS WHERE MS_BO_PHAN = A.MS_BO_PHAN AND CLASS_ID = B.CLASS_ID) AS GR_CLASS,
	C.PROBLEM_ID,D.PROBLEM_CODE,D.PROBLEM_NAME,(SELECT COUNT(*) FROM #CLASS WHERE MS_BO_PHAN = A.MS_BO_PHAN AND PROBLEM_ID = C.PROBLEM_ID) AS GR_PROLEM,
	F.CAUSE_ID,F.CAUSE_CODE,F.CAUSE_NAME,(SELECT COUNT(*) FROM #CLASS WHERE MS_BO_PHAN = A.MS_BO_PHAN AND CAUSE_ID = F.CAUSE_ID) AS GR_CAUSE,
	G.REMEDY_ID,G.REMEDY_CODE,G.REMEDY_NAME ,(SELECT COUNT(*) FROM #CLASS WHERE MS_BO_PHAN = A.MS_BO_PHAN AND REMEDY_ID = G.REMEDY_ID) AS GR_REMEDY
	FROM dbo.CAU_TRUC_THIET_BI A
	INNER JOIN dbo.CLASS_LIST B ON B.CLASS_ID = A.CLASS_ID
	INNER JOIN dbo.CLASS_PROBLEM C ON C.CLASS_ID = B.CLASS_ID
	INNER JOIN  dbo.PROBLEM_LIST D ON D.PROBLEM_ID = C.PROBLEM_ID
	INNER JOIN dbo.PROBLEM_CAUSE E ON E.PROBLEM_ID = D.PROBLEM_ID
	INNER JOIN dbo.CAUSE_LIST F ON F.CAUSE_ID = E.CAUSE_ID
	INNER JOIN  dbo.REMEDY_CAUSE G ON G.CAUSE_ID = F.CAUSE_ID
	WHERE A.MS_MAY = @deviceID	
	ORDER BY A.MS_BO_PHAN,D.PROBLEM_NAME


END
IF(@sDanhMuc ='GET_LISTWO_FAILRULE_ANALYSIS')
BEGIN
	SELECT DISTINCT A.MS_MAY,A.MS_BO_PHAN,A.TEN_BO_PHAN,B.CLASS_ID,B.CLASS_CODE,B.CLASS_NAME,0 AS GR_CLASS,
	C.PROBLEM_ID,D.PROBLEM_CODE,D.PROBLEM_NAME,0 GR_PROLEM,
	F.CAUSE_ID,F.CAUSE_CODE,F.CAUSE_NAME,0 AS GR_CAUSE,
	G.REMEDY_ID,G.REMEDY_CODE,G.REMEDY_NAME ,0 AS GR_REMEDY
	FROM dbo.CAU_TRUC_THIET_BI A
	INNER JOIN dbo.CLASS_LIST B ON B.CLASS_ID = A.CLASS_ID
	INNER JOIN dbo.CLASS_PROBLEM C ON C.CLASS_ID = B.CLASS_ID
	INNER JOIN  dbo.PROBLEM_LIST D ON D.PROBLEM_ID = C.PROBLEM_ID
	INNER JOIN dbo.PROBLEM_CAUSE E ON E.PROBLEM_ID = D.PROBLEM_ID
	INNER JOIN dbo.CAUSE_LIST F ON F.CAUSE_ID = E.CAUSE_ID
	INNER JOIN  dbo.REMEDY_CAUSE G ON G.CAUSE_ID = F.CAUSE_ID
	INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC H ON H.MS_BO_PHAN = A.MS_BO_PHAN
	WHERE A.MS_MAY = @deviceID	AND H.MS_PHIEU_BAO_TRI = @sCot1
END
IF(@sDanhMuc ='SAVE_LISTWO_FAILRULE_ANALYSIS')
BEGIN
	BEGIN TRANSACTION UpPTHH
	BEGIN TRY

	SELECT DISTINCT MS_MAY,MS_BO_PHAN,CLASS_ID,PROBLEM_ID,CAUSE_ID,REMEDY_ID INTO #BTPTHH FROM OPENJSON(@json) 
	WITH (MS_MAY NVARCHAR(30) '$.MS_MAY',MS_BO_PHAN NVARCHAR(50) '$.MS_BO_PHAN',CLASS_ID NVARCHAR(50) '$.CLASS_ID', PROBLEM_ID NVARCHAR(50) '$.PROBLEM_ID'
	, CAUSE_ID NVARCHAR(50) '$.CAUSE_ID', REMEDY_ID NVARCHAR(50) '$.REMEDY_ID');
	
	DELETE dbo.PHIEU_BAO_TRI_CLASS WHERE MS_PHIEU_BAO_TRI = @sCot1
	INSERT INTO dbo.PHIEU_BAO_TRI_CLASS(MS_PHIEU_BAO_TRI,MS_BO_PHAN,CLASS_ID,PROBLEM_ID,CAUSE_ID,REMEDY_ID,NOTE)
	SELECT @sCot1,MS_BO_PHAN,CLASS_ID,PROBLEM_ID,CAUSE_ID,REMEDY_ID,NULL FROM #BTPTHH
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION UpPTHH
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION UpPTHH;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
END
IF @sDanhMuc = 'HISTORY'
BEGIN
	IF @iLoai = 0 -- load combo bộ phận
	BEGIN
		SELECT MS_BO_PHAN AS MA_BP,TEN_BO_PHAN AS TEN_BP FROM dbo.CAU_TRUC_THIET_BI WHERE (MS_MAY = @deviceID) 
		AND HIEU_LUC = 1
		UNION
		SELECT '-1', '< All >' WHERE @CoAll = 1
		ORDER BY TEN_BP
	END

	IF @iLoai = 1 -- Loadcbo phụ tùng
	BEGIN
		SELECT A.MS_PT,B.TEN_PT FROM dbo.CAU_TRUC_THIET_BI_PHU_TUNG A
		INNER JOIN dbo.IC_PHU_TUNG B ON B.MS_PT = A.MS_PT
		WHERE B.ACTIVE_PT = 1 AND (A.MS_MAY = @deviceID) AND (A.MS_BO_PHAN  = @sCot1 OR @sCot1 = '-1')
		UNION
		SELECT '-1' , '< All >' WHERE @CoAll = 1
		ORDER BY TEN_PT
	END

	IF @iLoai = 2 -- LOAD LƯỚI
	BEGIN
		IF(@bcot1 = 0)
		BEGIN
			
			SELECT 1 AS LOAI, CONVERT(NVARCHAR(10),A.NGAY_LAP,4) AS NGAY,B.MS_BO_PHAN AS MA_BP,C.MO_TA_CV AS MA_PT ,NULL AS SL_THAY_THE FROM dbo.PHIEU_BAO_TRI A
			INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI
			INNER JOIN dbo.CONG_VIEC C ON C.MS_CV = B.MS_CV
			WHERE A.MS_MAY = @deviceID AND CONVERT(DATE,A.NGAY_LAP) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2)
			UNION
			SELECT 3 AS LOAI, CONVERT(NVARCHAR(10),A.NGAY_HC,4) AS NGAY,A.MS_MAY,REPLACE(B.TEN_LOAI_HIEU_CHUAN,'hiệu chuẩn','HC') AS MA_PT, NULL  FROM dbo.HIEU_CHUAN_MAY A
			INNER JOIN dbo.LOAI_HIEU_CHUAN B ON B.MS_LOAI_HIEU_CHUAN = A.MS_LOAI_HIEU_CHUAN
			WHERE A.MS_MAY = @deviceID AND CONVERT(DATE,A.NGAY_HC) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2)
		END	
		ELSE

		BEGIN
			
		SELECT A.MS_PHIEU_BAO_TRI,CONVERT(NVARCHAR(10),A.NGAY_LAP,4) AS NGAY,B.MS_BO_PHAN AS MA_BP,B.MS_CV,C.MO_TA_CV AS MA_PT ,NULL AS SL_THAY_THE INTO #PBTLS FROM dbo.PHIEU_BAO_TRI A
		INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI
		INNER JOIN dbo.CONG_VIEC C ON C.MS_CV = B.MS_CV
		WHERE A.MS_MAY = @deviceID AND CONVERT(DATE,A.NGAY_LAP) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2)
	
		SELECT 2 AS LOAI,NGAY,MA_BP,B.MS_PT AS MA_PT,B.SL_TT SL_THAY_THE FROM #PBTLS A
		INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI AND A.MS_CV = B.MS_CV AND A.MA_BP = B.MS_BO_PHAN
		WHERE (B.MS_BO_PHAN = @sCot1 OR @sCot1 ='-1') AND (B.MS_PT = @sCot2 OR @sCot2 ='-1')

		UNION
			SELECT 4 AS LOAI, CONVERT(NVARCHAR(10),A.NGAY,4) AS NGAY,A.MS_PT,REPLACE(B.TEN_LOAI_HIEU_CHUAN,'hiệu chuẩn','HC') AS MA_PT,NULL FROM dbo.HIEU_CHUAN_DHD A
			INNER JOIN dbo.LOAI_HIEU_CHUAN B ON B.MS_LOAI_HIEU_CHUAN = A.MS_LOAI_HIEU_CHUAN
			WHERE A.MS_MAY = @deviceID AND CONVERT(DATE,A.NGAY) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2)
		END	
	END
END
IF @sDanhMuc = 'HISTORY_REQUEST'
BEGIN
	IF @iLoai = 0 -- Loadcbo người yêu cầu
	BEGIN
		SELECT DISTINCT LTRIM(RTRIM(NGUOI_YEU_CAU)) AS ID_NYC,LTRIM(RTRIM(NGUOI_YEU_CAU))  AS TEN_NYC FROM dbo.YEU_CAU_NSD 
		UNION
		SELECT '-1' , '< All >'
		ORDER BY ID_NYC
	END
	IF @iLoai = 1 -- LOAD LƯỚI
	BEGIN
		--SELECT CONVERT(NVARCHAR(10),GETDATE(),103) NGAY_YC, N'Đã duyệt' TINH_TRANG_MAY, CONVERT(NVARCHAR(10),GETDATE(),103) NGAY_KT_PBT
		SELECT CONVERT(NVARCHAR(10),A.NGAY,4) AS NGAY_YC,B.MS_MAY,D.TEN_MAY,B.MO_TA_TINH_TRANG AS TINH_TRANG_MAY,CONVERT(NVARCHAR(10),C.NGAY_NGHIEM_THU,4) NGAY_KT_PBT,C.MS_PHIEU_BAO_TRI
		FROM dbo.YEU_CAU_NSD A
		INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.STT = A.STT
		LEFT JOIN dbo.PHIEU_BAO_TRI C ON C.MS_PHIEU_BAO_TRI = B.MS_PBT
		INNER JOIN dbo.MAY D ON D.MS_MAY = B.MS_MAY
		WHERE CONVERT(DATE,A.NGAY) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2) AND (B.MS_MAY = @deviceID OR @deviceID = '-1') AND (LTRIM(RTRIM(A.NGUOI_YEU_CAU)) = @sCot1 OR @sCot1 ='-1')
	END
END
IF(@sDanhMuc = 'ACCEPT_MAINTENANCE')
BEGIN
	SELECT DISTINCT MS_MAY,TEN_MAY INTO #MAY_USER1 FROM [dbo].[MGetMayUserNgay](@DNgay,@UserName,'-1',-1,-1,'-1','-1','-1',@NNgu)

	SELECT DISTINCT A.MS_PHIEU_BAO_TRI,A.MS_MAY,I.TEN_MAY,CONVERT(NVARCHAR(10),A.NGAY_KT_KH,4) NGAY_HOAN_THANH,E.TEN_LOAI_BT,B.MS_BO_PHAN,F.TEN_BO_PHAN,B.MS_CV,G.MO_TA_CV,C.MS_PT,
	H.TEN_PT,C.SL_TT
	FROM dbo.PHIEU_BAO_TRI A
	INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI
	LEFT JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG C ON C.MS_PHIEU_BAO_TRI = B.MS_PHIEU_BAO_TRI AND C.MS_CV = B.MS_CV AND C.MS_BO_PHAN = B.MS_BO_PHAN
	INNER JOIN  dbo.LOAI_BAO_TRI E ON E.MS_LOAI_BT = A.MS_LOAI_BT
	LEFT JOIN dbo.CAU_TRUC_THIET_BI F ON F.MS_MAY = A.MS_MAY AND F.MS_BO_PHAN = B.MS_BO_PHAN
	LEFT JOIN dbo.CONG_VIEC G ON G.MS_CV = B.MS_CV
	LEFT JOIN dbo.IC_PHU_TUNG H ON H.MS_PT = C.MS_PT
	INNER JOIN #MAY_USER1 I ON I.MS_MAY = A.MS_MAY
	WHERE CONVERT(DATE,A.NGAY_KT_KH) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2) AND TINH_TRANG_PBT = 3

END
IF(@sDanhMuc = 'COMPLETE_WORDORDER')
BEGIN
	IF NOT EXISTS(SELECT * FROM dbo.USER_CHUC_NANG WHERE STT = 7 AND USERNAME = @UserName)
	BEGIN
		SELECT 0 AS MA, N'Không có quyền hoàn thành phiếu' AS [NAME]
		RETURN;
	END
	--kiểm tra khai báo thời gian làm việc
	SELECT @icot1 = COUNT(*) FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1
	SELECT @icot2 = COUNT(*) FROM dbo.PHIEU_BAO_TRI_NHAN_SU WHERE MS_PHIEU_BAO_TRI = @sCot1
	IF((@icot1 + @icot2) = 0)
	BEGIN
		SELECT 0 AS MA, N'Chưa khai báo thời gian làm việc' AS [NAME]
		RETURN;
	END
	--kiểm tra có vật tư mà không có phiếu xuất
	IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1)
	BEGIN
		IF NOT EXISTS (SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_PHIEU_BAO_TRI = @sCot1)
		BEGIN
			SELECT 0 AS MA, N'Chưa có phiếu xuất kho' AS [NAME]
					--SELECT 1 AS MA, CONVERT(NVARCHAR(50),'SHOW_HH') AS [NAME]
			RETURN;
		END
		ELSE
        BEGIN
			IF NOT EXISTS (SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_PHIEU_BAO_TRI = @sCot1 AND LOCK = 1)
			BEGIN
				SELECT 0 AS MA, N'Chưa khóa phiếu xuất' AS [NAME]
				RETURN;
			END

		END

		--cập nhật vào bảng PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO
		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO WHERE MS_PHIEU_BAO_TRI  = @sCot1

		INSERT INTO [PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO]([MS_PHIEU_BAO_TRI],[MS_CV],[MS_BO_PHAN],[MS_PT],[STT],[MS_DH_XUAT_PT],[MS_DH_NHAP_PT],[MS_PTTT],[ID],[SL_TT],[DON_GIA],[NGOAI_TE],[TI_GIA],[TI_GIA_USD])
		SELECT A.MS_PHIEU_BAO_TRI, MS_CV, MS_BO_PHAN,
		T2.MS_PT, A.STT, T1.MS_DH_XUAT_PT,T3.MS_DH_NHAP_PT, T2.MS_PT, ID_XUAT, A.SL_TT, T6.DON_GIA, T6.NGOAI_TE, T6.TY_GIA, T6.TY_GIA_USD
		FROM dbo.IC_DON_HANG_XUAT AS T1 INNER JOIN
		dbo.IC_DON_HANG_XUAT_VAT_TU AS T2 ON T1.MS_DH_XUAT_PT = T2.MS_DH_XUAT_PT INNER JOIN
		dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET AS T3 ON T2.MS_DH_XUAT_PT = T3.MS_DH_XUAT_PT AND T2.MS_PT = T3.MS_PT INNER JOIN
		dbo.IC_DON_HANG_NHAP_VAT_TU AS T6 ON T3.MS_DH_NHAP_PT = T6.MS_DH_NHAP_PT AND T3.ID_XUAT = T6.ID AND T3.MS_PT = T6.MS_PT
		INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET A ON A.MS_PT = T3.MS_PT AND A.MS_PHIEU_BAO_TRI = T1.MS_PHIEU_BAO_TRI
		WHERE A.MS_PHIEU_BAO_TRI = @sCot1

		SELECT     DISTINCT   T1.MS_PHIEU_BAO_TRI, T3.MS_DH_NHAP_PT, T1.MS_DH_XUAT_PT, T3.ID_XUAT, T3.MS_PT,SL_VT INTO #TMP_XUAT
		FROM            dbo.IC_DON_HANG_XUAT AS T1 INNER JOIN
								 dbo.IC_DON_HANG_XUAT_VAT_TU AS T2 ON T1.MS_DH_XUAT_PT = T2.MS_DH_XUAT_PT INNER JOIN
								 dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET AS T3 ON T2.MS_DH_XUAT_PT = T3.MS_DH_XUAT_PT AND T2.MS_PT = T3.MS_PT
								 inner join PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET T4 ON T1.MS_PHIEU_BAO_TRI = T4.MS_PHIEU_BAO_TRI AND T3.MS_PT = T4.MS_PT
		WHERE (ISNULL(T4.GHI_CHU, N'') = N'') AND (T1.MS_PHIEU_BAO_TRI = @sCot1) 

		SELECT  DISTINCT      MS_PHIEU_BAO_TRI, MS_DH_NHAP_PT, MS_DH_XUAT_PT, ID, MS_PT, SUM(SL_TT) AS SL_TT INTO #TMP_PBTKHO
		FROM            dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO AS T2
		WHERE        (MS_PHIEU_BAO_TRI = @sCot1) 
		GROUP BY MS_PHIEU_BAO_TRI, MS_PT, MS_DH_XUAT_PT, MS_DH_NHAP_PT, ID

		SELECT   DISTINCT     T3.MS_PHIEU_BAO_TRI,  T3.MS_DH_XUAT_PT, T2.ID_GOC, T2.MS_DH_NHAP_PT_GOC, T4.MS_PT AS MS_PT_GOC, SUM(T4.SL_VT) AS SL_TRA  INTO #TMP_TRA
		FROM            dbo.IC_DON_HANG_NHAP AS T1 INNER JOIN
								 dbo.IC_DON_HANG_NHAP_VAT_TU AS T2 ON T1.MS_DH_NHAP_PT = T2.MS_DH_NHAP_PT INNER JOIN
								 dbo.IC_DON_HANG_XUAT AS T3 ON T1.MS_DHX = T3.MS_DH_XUAT_PT INNER JOIN
								 dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET AS T4 ON T2.MS_DH_NHAP_PT = T4.MS_DH_NHAP_PT AND T2.MS_PT = T4.MS_PT AND T2.ID = T4.ID 
		WHERE        (T1.MS_DANG_NHAP = 6) AND (T3.MS_PHIEU_BAO_TRI = @sCot1)
		GROUP BY T3.MS_PHIEU_BAO_TRI, T3.MS_DH_XUAT_PT,T2.ID_GOC, T2.MS_DH_NHAP_PT_GOC,T4.MS_PT 

		SELECT DISTINCT B.MS_PT AS PT_GOC, D.TEN_PT, B.MS_PT, D.TEN_PT AS TEN_PT_SD, B.MS_DH_XUAT_PT, B.MS_DH_NHAP_PT, 
		dbo.GetPhieuNhapTra( B.MS_DH_XUAT_PT, B.MS_DH_NHAP_PT) AS MS_DH_NHAP_TRA,
								ISNULL(B.SL_VT, 0) AS SL_VT_THUC_XUAT, ISNULL(C.SL_TRA, 0) SL_TRA,
								ROUND(SUM(ISNULL(B.SL_VT, 0)) - SUM(ISNULL(C.SL_TRA, 0)),2) AS SL_VT,
								ROUND(SUM(ISNULL(A_1.SL_TT, 0)),2) AS SL_TT
                      
							  , '' AS ID_XUAT, '' AS ID  
							  INTO #BTCAN
		FROM         #TMP_XUAT AS B INNER JOIN dbo.LOAI_VT AS E INNER JOIN
							  dbo.IC_PHU_TUNG AS D ON E.MS_LOAI_VT = D.MS_LOAI_VT ON B.MS_PT = D.MS_PT LEFT OUTER JOIN
								 #TMP_PBTKHO AS A_1 ON B.MS_PHIEU_BAO_TRI = A_1.MS_PHIEU_BAO_TRI AND B.MS_PT = A_1.MS_PT AND 
							  B.ID_XUAT = A_1.ID AND B.MS_DH_XUAT_PT = A_1.MS_DH_XUAT_PT AND B.MS_DH_NHAP_PT = A_1.MS_DH_NHAP_PT LEFT OUTER JOIN
								  #TMP_TRA AS C  ON B.MS_PHIEU_BAO_TRI = C.MS_PHIEU_BAO_TRI AND B.MS_PT = C.MS_PT_GOC AND B.ID_XUAT = C.ID_GOC
				AND B.MS_DH_XUAT_PT = C.MS_DH_XUAT_PT AND B.MS_DH_NHAP_PT = C.MS_DH_NHAP_PT_GOC 
   
		WHERE     (ISNULL(E.VAT_TU, 0) = 0) AND (B.MS_PHIEU_BAO_TRI = @sCot1)
		GROUP BY D.TEN_PT, B.MS_PT, B.MS_DH_XUAT_PT, B.MS_DH_NHAP_PT, SL_TRA, B.SL_VT, C.MS_DH_NHAP_PT_GOC       
		ORDER BY MS_PT, TEN_PT  

		IF EXISTS(SELECT * FROM #BTCAN WHERE (SL_VT - SL_TRA) != SL_TT)
		BEGIN
			SELECT 0 AS MA, N'Phụng tùng không cân,bạn kiểm tra lại' AS [NAME]
		END
	END
	-- cập nhật hoành thành phiếu bảo trì
	UPDATE PHIEU_BAO_TRI SET TT_SAU_BT=NULL,NGAY_NGHIEM_THU=NULL,NGUOI_NGHIEM_THU=NULL,TINH_TRANG_PBT = 3 WHERE MS_PHIEU_BAO_TRI= @sCot1
	UPDATE PHIEU_BAO_TRI_CONG_VIEC SET MS_MAY_TT=NULL ,MS_BO_PHAN_TT=NULL,PHU_TUNG_TT=NULL WHERE MS_PHIEU_BAO_TRI = @sCot1
	UPDATE PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_PHU_TRO SET HOAN_THANH = 1 WHERE MS_PHIEU_BAO_TRI = @sCot1
	UPDATE [PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET] SET HOAN_THANH = 1 WHERE MS_PHIEU_BAO_TRI= @sCot1
	UPDATE [PHIEU_BAO_TRI_NHAN_SU] SET HOAN_THANH = 1 WHERE MS_PHIEU_BAO_TRI = @sCot1
	--kiểm tra có show phân tích hư hỏng không
	SELECT TOP 1 @bcot1 = ISNULL(B.HU_HONG,0) FROM dbo.PHIEU_BAO_TRI A
	INNER JOIN dbo.LOAI_BAO_TRI B ON B.MS_LOAI_BT = A.MS_LOAI_BT
	WHERE A.MS_PHIEU_BAO_TRI = @sCot1

	IF @bcot1 = 1
	BEGIN
	--nếu là hư hỏng thì kiểm tra công việc có class hư hỏng không
	 IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC A
	INNER JOIN  dbo.CAU_TRUC_THIET_BI B ON B.MS_BO_PHAN = A.MS_BO_PHAN AND B.MS_MAY = @deviceID AND ISNULL(B.CLASS_ID,'') != '')
	BEGIN
		SELECT 1 AS MA, CONVERT(NVARCHAR(50),'SHOW_HH') AS [NAME]
		RETURN;
	END
	END
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]

END
IF(@sDanhMuc = 'ACCEPTANCE_WORDORDER')
BEGIN
--acceptance
	--kiểm tra có quyền không
	IF NOT EXISTS(SELECT * FROM dbo.USER_CHUC_NANG WHERE STT = 8 AND USERNAME = @UserName)
	BEGIN
		SELECT 0 AS MA, N'Không có quyền nghiệm thu phiếu' AS [NAME]
		RETURN;
	END

	--kiểm tra khai báo thời gian làm việc
	SELECT @icot1 = COUNT(*) FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1
	SELECT @icot2 = COUNT(*) FROM dbo.PHIEU_BAO_TRI_NHAN_SU WHERE MS_PHIEU_BAO_TRI = @sCot1
	IF((@icot1 + @icot2) = 0)
	BEGIN
		SELECT 0 AS MA, N'Chưa khai báo thời gian làm việc' AS [NAME]
		RETURN;
	END
	--kiểm tra có vật tư mà không có phiếu xuất
	IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1)
	BEGIN
		IF NOT EXISTS (SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_PHIEU_BAO_TRI = @sCot1)
		BEGIN
			SELECT 0 AS MA, N'Chưa có phiếu xuất kho' AS [NAME]
			RETURN;
		END
		ELSE
        BEGIN
			IF NOT EXISTS (SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_PHIEU_BAO_TRI = @sCot1 AND LOCK = 1)
			BEGIN
				SELECT 0 AS MA, N'Chưa khóa phiếu xuất' AS [NAME]
				RETURN;
			END

		END

		--cập nhật vào bảng PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO
		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO WHERE MS_PHIEU_BAO_TRI  = @sCot1

		INSERT INTO [PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO]([MS_PHIEU_BAO_TRI],[MS_CV],[MS_BO_PHAN],[MS_PT],[STT],[MS_DH_XUAT_PT],[MS_DH_NHAP_PT],[MS_PTTT],[ID],[SL_TT],[DON_GIA],[NGOAI_TE],[TI_GIA],[TI_GIA_USD])
		SELECT A.MS_PHIEU_BAO_TRI, MS_CV, MS_BO_PHAN,
		T2.MS_PT, A.STT, T1.MS_DH_XUAT_PT,T3.MS_DH_NHAP_PT, T2.MS_PT, ID_XUAT, A.SL_TT, T6.DON_GIA, T6.NGOAI_TE, T6.TY_GIA, T6.TY_GIA_USD
		FROM dbo.IC_DON_HANG_XUAT AS T1 INNER JOIN
		dbo.IC_DON_HANG_XUAT_VAT_TU AS T2 ON T1.MS_DH_XUAT_PT = T2.MS_DH_XUAT_PT INNER JOIN
		dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET AS T3 ON T2.MS_DH_XUAT_PT = T3.MS_DH_XUAT_PT AND T2.MS_PT = T3.MS_PT INNER JOIN
		dbo.IC_DON_HANG_NHAP_VAT_TU AS T6 ON T3.MS_DH_NHAP_PT = T6.MS_DH_NHAP_PT AND T3.ID_XUAT = T6.ID AND T3.MS_PT = T6.MS_PT
		INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET A ON A.MS_PT = T3.MS_PT AND A.MS_PHIEU_BAO_TRI = T1.MS_PHIEU_BAO_TRI
		WHERE A.MS_PHIEU_BAO_TRI = @sCot1

		SELECT     DISTINCT   T1.MS_PHIEU_BAO_TRI, T3.MS_DH_NHAP_PT, T1.MS_DH_XUAT_PT, T3.ID_XUAT, T3.MS_PT,SL_VT INTO #TMP_XUAT1
		FROM            dbo.IC_DON_HANG_XUAT AS T1 INNER JOIN
								 dbo.IC_DON_HANG_XUAT_VAT_TU AS T2 ON T1.MS_DH_XUAT_PT = T2.MS_DH_XUAT_PT INNER JOIN
								 dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET AS T3 ON T2.MS_DH_XUAT_PT = T3.MS_DH_XUAT_PT AND T2.MS_PT = T3.MS_PT
								 inner join PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET T4 ON T1.MS_PHIEU_BAO_TRI = T4.MS_PHIEU_BAO_TRI AND T3.MS_PT = T4.MS_PT
		WHERE (ISNULL(T4.GHI_CHU, N'') = N'') AND (T1.MS_PHIEU_BAO_TRI = @sCot1) 

		SELECT  DISTINCT      MS_PHIEU_BAO_TRI, MS_DH_NHAP_PT, MS_DH_XUAT_PT, ID, MS_PT, SUM(SL_TT) AS SL_TT INTO #TMP_PBTKHO1
		FROM            dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO AS T2
		WHERE        (MS_PHIEU_BAO_TRI = @sCot1) 
		GROUP BY MS_PHIEU_BAO_TRI, MS_PT, MS_DH_XUAT_PT, MS_DH_NHAP_PT, ID

		SELECT   DISTINCT     T3.MS_PHIEU_BAO_TRI,  T3.MS_DH_XUAT_PT, T2.ID_GOC, T2.MS_DH_NHAP_PT_GOC, T4.MS_PT AS MS_PT_GOC, SUM(T4.SL_VT) AS SL_TRA  INTO #TMP_TRA1
		FROM            dbo.IC_DON_HANG_NHAP AS T1 INNER JOIN
								 dbo.IC_DON_HANG_NHAP_VAT_TU AS T2 ON T1.MS_DH_NHAP_PT = T2.MS_DH_NHAP_PT INNER JOIN
								 dbo.IC_DON_HANG_XUAT AS T3 ON T1.MS_DHX = T3.MS_DH_XUAT_PT INNER JOIN
								 dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET AS T4 ON T2.MS_DH_NHAP_PT = T4.MS_DH_NHAP_PT AND T2.MS_PT = T4.MS_PT AND T2.ID = T4.ID 
		WHERE        (T1.MS_DANG_NHAP = 6) AND (T3.MS_PHIEU_BAO_TRI = @sCot1)
		GROUP BY T3.MS_PHIEU_BAO_TRI, T3.MS_DH_XUAT_PT,T2.ID_GOC, T2.MS_DH_NHAP_PT_GOC,T4.MS_PT 

		SELECT DISTINCT B.MS_PT AS PT_GOC, D.TEN_PT, B.MS_PT, D.TEN_PT AS TEN_PT_SD, B.MS_DH_XUAT_PT, B.MS_DH_NHAP_PT, 
		dbo.GetPhieuNhapTra( B.MS_DH_XUAT_PT, B.MS_DH_NHAP_PT) AS MS_DH_NHAP_TRA,
								ISNULL(B.SL_VT, 0) AS SL_VT_THUC_XUAT, ISNULL(C.SL_TRA, 0) SL_TRA,
								ROUND(SUM(ISNULL(B.SL_VT, 0)) - SUM(ISNULL(C.SL_TRA, 0)),2) AS SL_VT,
								ROUND(SUM(ISNULL(A_1.SL_TT, 0)),2) AS SL_TT
                      
							  , '' AS ID_XUAT, '' AS ID  
							  INTO #BTCAN1
		FROM         #TMP_XUAT1 AS B INNER JOIN dbo.LOAI_VT AS E INNER JOIN
							  dbo.IC_PHU_TUNG AS D ON E.MS_LOAI_VT = D.MS_LOAI_VT ON B.MS_PT = D.MS_PT LEFT OUTER JOIN
								 #TMP_PBTKHO1 AS A_1 ON B.MS_PHIEU_BAO_TRI = A_1.MS_PHIEU_BAO_TRI AND B.MS_PT = A_1.MS_PT AND 
							  B.ID_XUAT = A_1.ID AND B.MS_DH_XUAT_PT = A_1.MS_DH_XUAT_PT AND B.MS_DH_NHAP_PT = A_1.MS_DH_NHAP_PT LEFT OUTER JOIN
								  #TMP_TRA1 AS C  ON B.MS_PHIEU_BAO_TRI = C.MS_PHIEU_BAO_TRI AND B.MS_PT = C.MS_PT_GOC AND B.ID_XUAT = C.ID_GOC
				AND B.MS_DH_XUAT_PT = C.MS_DH_XUAT_PT AND B.MS_DH_NHAP_PT = C.MS_DH_NHAP_PT_GOC 
   
		WHERE     (ISNULL(E.VAT_TU, 0) = 0) AND (B.MS_PHIEU_BAO_TRI = @sCot1)
		GROUP BY D.TEN_PT, B.MS_PT, B.MS_DH_XUAT_PT, B.MS_DH_NHAP_PT, SL_TRA, B.SL_VT, C.MS_DH_NHAP_PT_GOC       
		ORDER BY MS_PT, TEN_PT  

		IF EXISTS(SELECT * FROM #BTCAN1 WHERE (SL_VT - SL_TRA) != SL_TT)
		BEGIN
			SELECT 0 AS MA, N'Phụng tùng không cân,bạn kiểm tra lại' AS [NAME]
		END
	END

	UPDATE PHIEU_BAO_TRI_CONG_VIEC SET H_THANH = 1,PT_HOAN_THANH = 100 WHERE MS_PHIEU_BAO_TRI= @sCot1

	UPDATE PHIEU_BAO_TRI_CONG_VIEC SET NGAY_HOAN_THANH = GETDATE() WHERE MS_PHIEU_BAO_TRI= @sCot1 AND NGAY_HOAN_THANH IS NULL

	UPDATE PHIEU_BAO_TRI_CV_PHU_TRO SET NGAY_HOAN_THANH= GETDATE() WHERE MS_PHIEU_BAO_TRI= @sCot1 AND NGAY_HOAN_THANH IS NULL

	--insert chi phi
	DECLARE @CPVT FLOAT = 0,@CPVTUSD FLOAT = 0,@CPPT FLOAT = 0,@CPPTUSD FLOAT = 0 ,@TG FLOAT,@TGUSD FLOAT,@LUONG FLOAT

	--set chi phí vật tư
	SELECT        T3.MS_PHIEU_BAO_TRI,  T3.MS_DH_XUAT_PT, T2.ID_GOC, T2.MS_DH_NHAP_PT_GOC, T4.MS_PT AS MS_PT_GOC, SUM(T4.SL_VT) AS SL_TRA INTO #TMP_TRA2
FROM            dbo.IC_DON_HANG_NHAP AS T1 INNER JOIN
                         dbo.IC_DON_HANG_NHAP_VAT_TU AS T2 ON T1.MS_DH_NHAP_PT = T2.MS_DH_NHAP_PT INNER JOIN
                         dbo.IC_DON_HANG_XUAT AS T3 ON T1.MS_DHX = T3.MS_DH_XUAT_PT INNER JOIN
                         dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET AS T4 ON T2.MS_DH_NHAP_PT = T4.MS_DH_NHAP_PT AND T2.MS_PT = T4.MS_PT AND T2.ID = T4.ID 
WHERE        (T1.MS_DANG_NHAP = 6) AND (T3.MS_PHIEU_BAO_TRI = @sCot1)
GROUP BY T3.MS_PHIEU_BAO_TRI, T3.MS_DH_XUAT_PT,T2.ID_GOC, T2.MS_DH_NHAP_PT_GOC,T4.MS_PT 

	-- set chi phí vật tư
	SELECT  @CPVT = SUM((ISNULL(dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET.SL_VT, 0) - ISNULL(T.SL_TRA,0)) * ISNULL(dbo.IC_DON_HANG_NHAP_VAT_TU.DON_GIA, 0) 
						  ), 
                      
						 @CPVTUSD = SUM((ISNULL(dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET.SL_VT, 0) - ISNULL(T.SL_TRA,0))
						  * ISNULL(dbo.IC_DON_HANG_NHAP_VAT_TU.DON_GIA, 0) * dbo.IC_DON_HANG_NHAP_VAT_TU.TY_GIA_USD / dbo.IC_DON_HANG_NHAP_VAT_TU.TY_GIA)
                      
	FROM         dbo.IC_DON_HANG_NHAP_VAT_TU INNER JOIN
						  dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET ON 
						  dbo.IC_DON_HANG_NHAP_VAT_TU.MS_DH_NHAP_PT = dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET.MS_DH_NHAP_PT AND 
						  dbo.IC_DON_HANG_NHAP_VAT_TU.MS_PT = dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET.MS_PT INNER JOIN
						  dbo.IC_DON_HANG_XUAT ON 
						  dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET.MS_DH_XUAT_PT = dbo.IC_DON_HANG_XUAT.MS_DH_XUAT_PT INNER JOIN
						  dbo.IC_PHU_TUNG ON dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET.MS_PT = dbo.IC_PHU_TUNG.MS_PT INNER JOIN
						  dbo.LOAI_VT ON dbo.IC_PHU_TUNG.MS_LOAI_VT = dbo.LOAI_VT.MS_LOAI_VT
						  LEFT JOIN #TMP_TRA2 T ON IC_DON_HANG_NHAP_VAT_TU.MS_DH_NHAP_PT = T.MS_DH_NHAP_PT_GOC
						  AND IC_DON_HANG_XUAT_VAT_TU_CHI_TIET.MS_PT = T.MS_PT_GOC AND IC_DON_HANG_XUAT.MS_DH_XUAT_PT = T.MS_DH_XUAT_PT
						  AND dbo.IC_DON_HANG_XUAT.MS_PHIEU_BAO_TRI = T.MS_PHIEU_BAO_TRI
	WHERE     (dbo.IC_DON_HANG_XUAT.MS_PHIEU_BAO_TRI = @sCot1) AND (dbo.LOAI_VT.VAT_TU = 1)

	--set chi phí phụ tùng
	SELECT @CPPT = SUM(SL_TT*ABS(A.DON_GIA - ISNULL(T.DON_GIA,0))) , @CPVTUSD = SUM(SL_TT*ABS(A.DON_GIA - ISNULL(T.DON_GIA,0))*TI_GIA_USD/TI_GIA)   FROM PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO A INNER JOIN IC_PHU_TUNG B ON A.MS_PT = B.MS_PT  
	INNER JOIN LOAI_VT C ON B.MS_LOAI_VT = C.MS_LOAI_VT LEFT JOIN (SELECT MS_PT,DON_GIA FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT in
	(SELECT MS_DH_NHAP_PT FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_XUAT_PT IN (SELECT MS_DH_XUAT_PT   FROM PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO WHERE MS_PHIEU_BAO_TRI = @sCot1))) AS T ON T.MS_PT = B.MS_PT WHERE MS_PHIEU_BAO_TRI= @sCot1 AND SL_TT IS NOT NULL AND SL_TT > 0 AND VAT_TU = 0 

	SELECT @TG = TI_GIA,@TGUSD = TI_GIA_USD 
                     FROM TI_GIA_NT INNER JOIN NGOAI_TE ON TI_GIA_NT.NGOAI_TE=NGOAI_TE.NGOAI_TE 
                     WHERE NGOAI_TE.MAC_DINH=1 AND NGAY_NHAP >= (SELECT ISNULL(MAX(NGAY_NHAP),0) 
                                                                 FROM TI_GIA_NT INNER JOIN NGOAI_TE ON TI_GIA_NT.NGOAI_TE = NGOAI_TE.NGOAI_TE 
                                                                 WHERE DATEDIFF(DAY,NGAY_NHAP,GETDATE())>=0)


	--chi phí nhân công
	SELECT T1.MS_CONG_NHAN, ISNULL(SUM(TONG_GIO),0) AS TONG_GIO 
INTO #CNSG
FROM 
(
SELECT MS_CONG_NHAN,SUM(SO_GIO) AS TONG_GIO FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1 GROUP BY MS_CONG_NHAN
UNION
SELECT MS_CONG_NHAN,SUM(SO_GIO) AS TONG_GIO FROM PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_PHU_TRO WHERE MS_PHIEU_BAO_TRI = @sCot1 GROUP BY MS_CONG_NHAN
UNION
SELECT MS_CONG_NHAN,SUM(SO_GIO) AS TONG_GIO FROM dbo.PHIEU_BAO_TRI_NHAN_SU WHERE MS_PHIEU_BAO_TRI = @sCot1 GROUP BY MS_CONG_NHAN) T1
GROUP BY T1.MS_CONG_NHAN

DECLARE @PHUT_GIO_PBT INT = 1
SELECT TOP 1 @PHUT_GIO_PBT = PHUT_GIO_PBT FROM dbo.THONG_TIN_CHUNG

SELECT @LUONG = ISNULL(SUM((ISNULL(TONG_GIO,0) * ISNULL(T2.LUONG_CO_BAN,0))/ 
(CASE @PHUT_GIO_PBT WHEN 1 THEN (26*8*60) ELSE (26*8) END)),0)
 FROM 
(
SELECT T1.MS_CONG_NHAN, MAX(T1.NGAY_HIEU_LUC) AS NGAY_HIEU_LUC
FROM dbo.LUONG_CO_BAN T1 INNER JOIN #CNSG T2 ON T1.MS_CONG_NHAN = T2.MS_CONG_NHAN 
GROUP BY T1.MS_CONG_NHAN
HAVING MAX(T1.NGAY_HIEU_LUC) <= GETDATE()
) T1 INNER JOIN dbo.LUONG_CO_BAN T2 ON T2.MS_CONG_NHAN = T1.MS_CONG_NHAN AND T2.NGAY_HIEU_LUC = T1.NGAY_HIEU_LUC
INNER JOIN #CNSG T3 ON T1.MS_CONG_NHAN = T3.MS_CONG_NHAN

IF EXISTS( SELECT * FROM dbo.PHIEU_BAO_TRI_CHI_PHI WHERE MS_PHIEU_BAO_TRI =@sCot1)
BEGIN
	UPDATE dbo.PHIEU_BAO_TRI_CHI_PHI 
	SET CHI_PHI_PHU_TUNG = @CPPT,
	CHI_PHI_PHU_TUNG_USD = @CPPTUSD,
	CHI_PHI_VAT_TU = @CPVT,
	CHI_PHI_VAT_TU_USD = @CPVTUSD,
	CHI_PHI_NHAN_CONG =  CASE ISNULL(@LUONG,0) WHEN 0 THEN 0 ELSE  @LUONG * @TG END,
	CHI_PHI_NHAN_CONG_USD =  CASE ISNULL(@LUONG,0) WHEN 0 THEN 0 ELSE  @LUONG * @TGUSD END,
	CHI_PHI_KHAC = CASE ISNULL(@fcot1,0) WHEN 0 THEN 0 ELSE  @fcot1 * @TG END,
	CHI_PHI_KHAC_USD = CASE ISNULL(@fcot1,0) WHEN 0 THEN 0 ELSE		@fcot1 * @TGUSD END
	WHERE MS_PHIEU_BAO_TRI =@sCot1
END
ELSE
BEGIN

INSERT INTO dbo.PHIEU_BAO_TRI_CHI_PHI
(
    MS_PHIEU_BAO_TRI,
    CHI_PHI_PHU_TUNG,
    CHI_PHI_PHU_TUNG_USD,
    CHI_PHI_VAT_TU,
    CHI_PHI_VAT_TU_USD,
    CHI_PHI_NHAN_CONG,
    CHI_PHI_NHAN_CONG_USD,
    CHI_PHI_DV,
    CHI_PHI_DV_USD,
    CHI_PHI_KHAC,
    CHI_PHI_KHAC_USD
)
VALUES
(   @sCot1, -- MS_PHIEU_BAO_TRI - nvarchar(20)
    @CPPT, -- CHI_PHI_PHU_TUNG - float
    @CPPTUSD, -- CHI_PHI_PHU_TUNG_USD - float
    @CPVT, -- CHI_PHI_VAT_TU - float
    @CPVTUSD, -- CHI_PHI_VAT_TU_USD - float
    CASE ISNULL(@LUONG,0) WHEN 0 THEN 0 ELSE  @LUONG * @TG END, -- CHI_PHI_NHAN_CONG - float
    CASE ISNULL(@LUONG,0) WHEN 0 THEN 0 ELSE  ROUND(@LUONG * @TGUSD,2) END, -- CHI_PHI_NHAN_CONG_USD - float
    0, -- CHI_PHI_DV - float
    0, -- CHI_PHI_DV_USD - float
    CASE ISNULL(@fcot1,0) WHEN 0 THEN 0 ELSE  @fcot1 * @TG END, -- CHI_PHI_KHAC - float
    CASE ISNULL(@fcot1,0) WHEN 0 THEN 0 ELSE  @fcot1 * @TGUSD END  -- CHI_PHI_KHAC_USD - float
    )
	END

	UPDATE dbo.PHIEU_BAO_TRI SET TINH_TRANG_PBT = 4,
	MS_TT_CT = (SELECT TOP 1 MS_TT_CT FROM TINH_TRANG_PBT_CT WHERE MAC_DINH = 1 AND STT = 4),
    TT_SAU_BT = @sCot2,
	TT_SAU_BT_ANH =@sCot2,
    NGAY_NGHIEM_THU = GETDATE(),
	NGUOI_NGHIEM_THU = (SELECT MS_CONG_NHAN FROM dbo.USERS WHERE USERNAME =@UserName),
	USERNAME_NGUOI_NT = @UserName,
	UPDATE_NGAY_CUOI = GETDATE()
	WHERE MS_PHIEU_BAO_TRI =@sCot1

	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
END

IF(@sDanhMuc ='GETLIST_MOVE_DEVICE')
BEGIN
	SELECT CONVERT(BIT,0) AS CHON,A.MS_MAY,D.TEN_MAY,A.NGAY_CHUYEN,A.KHO_DI,B.Ten_N_XUONG AS TEN_KHO_DI,A.KHO_DEN,C.Ten_N_XUONG AS TEN_KHO_DEN,A.NGAY_NHAN,DATEDIFF(DAY,A.NGAY_CHUYEN,GETDATE()) AS SO_NGAY 
	FROM dbo.DI_CHUYEN_THIET_BI A
	INNER JOIN dbo.NHA_XUONG B ON A.KHO_DI = B.MS_N_XUONG
	INNER JOIN dbo.NHA_XUONG C ON A.KHO_DEN = C.MS_N_XUONG
	INNER JOIN dbo.MAY D ON D.MS_MAY = A.MS_MAY
	WHERE A.NGAY_NHAN IS NULL 

END
IF(@sDanhMuc = 'SAVE_MOVE_DEVICE')
BEGIN
	BEGIN TRANSACTION UpPTHH
	BEGIN TRY
	--spCMMSWEB
	SELECT DISTINCT CHON,MS_MAY,TEN_MAY,NGAY_CHUYEN,KHO_DI,TEN_KHO_DI,KHO_DEN,TEN_KHO_DEN,NGAY_NHAN,SO_NGAY INTO #BTMoveDV FROM OPENJSON(@json) 
	WITH (CHON BIT '$.CHON',MS_MAY NVARCHAR(30) '$.MS_MAY',TEN_MAY NVARCHAR(50) '$.TEN_MAY', NGAY_CHUYEN DATETIME '$.NGAY_CHUYEN',
	KHO_DI NVARCHAR(50) '$.KHO_DI',TEN_KHO_DI NVARCHAR(100) '$.TEN_KHO_DI',KHO_DEN NVARCHAR(100) '$.KHO_DEN',TEN_KHO_DEN NVARCHAR(100) '$.TEN_KHO_DEN',NGAY_NHAN DATETIME '$.NGAY_NHAN',SO_NGAY INT '$.SO_NGAY');

	--bắc đầu di chuyển
		INSERT INTO dbo.DI_CHUYEN_THIET_BI(NGAY_CHUYEN,KHO_DI,KHO_DEN,MS_MAY,NGAY_NHAN,USER_CHUYEN,USER_NHAN)
		SELECT NGAY_CHUYEN,KHO_DI,KHO_DEN,MS_MAY,NGAY_NHAN,@UserName,CASE ISNULL(NGAY_NHAN,'') WHEN '' THEN NULL ELSE @UserName END FROM #BTMoveDV WHERE CHON = 1

		UPDATE A
		SET A.NGAY_NHAN = B.NGAY_NHAN,
		A.USER_NHAN = @UserName
		FROM dbo.DI_CHUYEN_THIET_BI A
		INNER JOIN #BTMoveDV B ON A.MS_MAY =  B.MS_MAY AND A.NGAY_CHUYEN = B.NGAY_CHUYEN AND A.KHO_DI = B.KHO_DI WHERE ISNULL(B.NGAY_NHAN,'') != ''

		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION UpPTHH
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION UpPTHH;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
	
END

IF(@sDanhMuc ='GETLIST_INVENTORY_DEVICE')
BEGIN
	SELECT CONVERT(BIT,0) AS CHON,A.MS_MAY,C.TEN_MAY,A.NGAY_SCAN,A.MS_KHO,B.Ten_N_XUONG AS TEN_KHO
	INTO	 #BT
	FROM dbo.KIEM_KE_THIET_BI A
	INNER JOIN dbo.NHA_XUONG B ON A.MS_KHO = B.MS_N_XUONG
	INNER JOIN dbo.MAY C ON C.MS_MAY = A.MS_MAY
	WHERE ISNULL(A.DA_KIEM,0) = 0

	SELECT CHON,
           MS_MAY,
           TEN_MAY,
           NGAY_SCAN,
           MS_KHO,
           TEN_KHO FROM #BT
END

IF(@sDanhMuc = 'SAVE_INVENTORY_DEVICE')
BEGIN
	BEGIN TRANSACTION UpKK
	BEGIN TRY
	--spCMMSWEB
	SELECT DISTINCT CHON,MS_MAY,TEN_MAY,NGAY_SCAN,MS_KHO,TEN_KHO INTO #BTKK FROM OPENJSON(@json) 	
	WITH (CHON BIT '$.CHON',MS_MAY NVARCHAR(30) '$.MS_MAY',TEN_MAY NVARCHAR(50) '$.TEN_MAY', NGAY_SCAN DATETIME '$.NGAY_SCAN',
	MS_KHO NVARCHAR(50) '$.MS_KHO',TEN_KHO NVARCHAR(100) '$.TEN_KHO');

	--bắc đầu di chuyển
		INSERT INTO dbo.KIEM_KE_THIET_BI(NGAY_SCAN,MS_KHO,MS_MAY,USER_SCAN,DA_KIEM,NGAY_KIEM,USER_KIEM)
		SELECT NGAY_SCAN,MS_KHO,MS_MAY,@UserName,0,NULL,NULL FROM #BTKK WHERE CHON = 1


		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION UpKK
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION UpKK;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
	
END

	
END
GO

