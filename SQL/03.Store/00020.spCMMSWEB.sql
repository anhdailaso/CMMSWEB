

ALTER PROCEDURE [dbo].[spCMMSWEB]
	@sDanhMuc NVARCHAR(500) = N'GET_MYECOMAINT',
	@DNgay DATE = '04/28/2025',
	@UserName NVARCHAR(255) = 'admin',
	@MsNXuong nvarchar(50) = '-1',
	@NNgu INT = 0,
	@bcot1 BIT = 1,
	@icot1 INT = 17,
	@icot2 INT = 1,
	@icot3 INT = 100,
	@iLoai INT = 2,
	@CoAll INT = 0,
	@fcot1 FLOAT = '-1',
	@fcot2 FLOAT = '-1',
	@fcot3 FLOAT = '-1',
	@sCot1 NVARCHAR(500) = '-1',
	@sCot2 NVARCHAR(500) = '-1',
	@sCot3 NVARCHAR(500) = '',
	@sCot4 NVARCHAR(500) = '',
	@sCot5 NVARCHAR(500) = '',
	@sCot6 NVARCHAR(500) = '',
	@dCot1 DATETIME = '04/18/2024',
	@dCot2 DATETIME = '04/18/2023',
	@json NVARCHAR(MAX) = '[{"MS_CONG_NHAN":100019},{"MS_CONG_NHAN":100066},{"MS_CONG_NHAN":100102}]',
	@deviceID NVARCHAR(50) ='-1',
	@isDue INT = 0,
    @stt INT = -1
	--,
	--@TotalRows INT = NULL OUTPUT
AS 
BEGIN
IF(@sDanhMuc = 'GET_MYECOMAINT')
BEGIN


SELECT DISTINCT MS_MAY,TEN_MAY INTO #MAY_USER FROM [dbo].[MGetMayUserNgay](@DNgay,@UserName,@MsNXuong,-1,-1,@sCot1,'-1',-1,@NNgu)

SELECT DISTINCT T1.MS_MAY,T2.TEN_MAY,T1.MS_PHIEU_BAO_TRI,CASE WHEN CONVERT(DATE,T1.NGAY_KT_KH) < CONVERT(DATE,GETDATE()) THEN	1 ELSE 0 END TREBT,MS_UU_TIEN AS MUC_BT,
CONVERT(INT,T3.HU_HONG) AS HH_BT
INTO #TMPPBT FROM dbo.PHIEU_BAO_TRI T1 
INNER JOIN #MAY_USER T2 ON T1.MS_MAY = T2.MS_MAY 
INNER JOIN dbo.LOAI_BAO_TRI T3 ON T3.MS_LOAI_BT = T1.MS_LOAI_BT
WHERE (CONVERT(DATE, NGAY_BD_KH) BETWEEN DATEADD(YEAR,-1,@DNgay) AND CONVERT(DATE,@DNgay)) AND (TINH_TRANG_PBT =2) 


SELECT DISTINCT MS_MAY,T1.TEN_MAY,CONVERT(DATE,MAX(NGAY_KE)) AS N_K,CASE WHEN CONVERT(DATE,MAX(NGAY_KE)) < CONVERT(DATE,GETDATE()) THEN 2 ELSE 1 END TREGS
INTO #GSTT FROM [dbo].[MGetHieuChuanKeGSTT](DATEADD(YEAR,-1,@DNgay),@DNgay,@UserName,@MsNXuong,-1,-1,@sCot1,'-1',-1,1,@NNgu) T1
GROUP BY MS_MAY,TEN_MAY


SELECT DISTINCT B.MS_MAY,C.TEN_MAY,A.MS_YEU_CAU,
CASE WHEN CONVERT(DATE, DATEADD(DAY,(SELECT TOP 1 T.SO_NGAY_PHAI_BD FROM dbo.MUC_UU_TIEN T WHERE T.MS_UU_TIEN = B.MS_UU_TIEN),A.NGAY)) < CONVERT(DATE,GETDATE()) THEN	1 ELSE 0 END  AS TREYC,
B.MS_UU_TIEN AS MUC_YC, CASE ISNULL(B.USERNAME_DSX,'') WHEN '' THEN 0 ELSE 1 END AS DUYET_YC 
INTO #TMPYC FROM  dbo.YEU_CAU_NSD A
INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.STT = A.STT 
INNER JOIN #MAY_USER C ON C.MS_MAY = B.MS_MAY 
WHERE  (CONVERT(DATE,A.NGAY) BETWEEN DATEADD(YEAR,-1,GETDATE()) AND CONVERT(DATE,GETDATE())) AND (B.USERNAME_DSX IS NULL OR (B.USERNAME_DBT IS NULL AND B.THUC_HIEN_DSX = 1 ))


SELECT DISTINCT MS_MAY,TEN_MAY,((SELECT MS_PHIEU_BAO_TRI,TREBT,MUC_BT,HH_BT  FROM #TMPPBT T WHERE T.MS_MAY = A.MS_MAY   FOR JSON AUTO )) AS sListBT
INTO #PBT
FROM #TMPPBT A
GROUP BY A.MS_MAY,A.TEN_MAY

SELECT DISTINCT MS_MAY,TEN_MAY,((SELECT T.MS_YEU_CAU,TREYC,MUC_YC,DUYET_YC  FROM #TMPYC T WHERE T.MS_MAY = A.MS_MAY   FOR JSON AUTO )) AS sListYC
INTO #YC
FROM #TMPYC A
GROUP BY A.MS_MAY,A.TEN_MAY


SELECT DISTINCT T1.MS_MAY,T1.TEN_MAY,T4.sListYC,T2.sListBT,T3.TREGS
INTO #DSECOMAINT
FROM (
	SELECT MS_MAY,TEN_MAY FROM #GSTT 
	UNION SELECT MS_MAY,TEN_MAY FROM #PBT
	UNION SELECT MS_MAY,TEN_MAY FROM #YC
) T1 
LEFT JOIN  #PBT T2 ON T1.MS_MAY = T2.MS_MAY 
LEFT JOIN #GSTT T3 ON T1.MS_MAY = T3.MS_MAY 
LEFT JOIN #YC T4 ON T1.MS_MAY = T4.MS_MAY
 WHERE T1.MS_MAY = @deviceID OR @deviceID ='-1'


---spCMMSWEB

 IF(@bcot1 = 1)
 BEGIN
		SELECT MS_MAY,
             TEN_MAY,
             ISNULL(sListBT,'') AS sListBT,
             ISNULL(sListYC,'') sListYC,
             ISNULL(TREGS, CASE WHEN (SELECT COUNT(*) FROM dbo.CAU_TRUC_THIET_BI_TS_GSTT T WHERE T.MS_MAY = A.MS_MAY) > 0 THEN 1 ELSE 0 END) AS TREGS 
			 FROM #DSECOMAINT A
			 ORDER BY MS_MAY
 END
 ELSE
 BEGIN
 ---lấy thêm những mấy chưa có

     	SELECT MS_MAY,
             TEN_MAY,
             ISNULL(sListBT,'') AS sListBT,
             ISNULL(sListYC,'') sListYC,
             ISNULL(TREGS, CASE WHEN (SELECT COUNT(*) FROM dbo.CAU_TRUC_THIET_BI_TS_GSTT T WHERE T.MS_MAY = A.MS_MAY) > 0 THEN 1 ELSE 0 END) AS TREGS  
			 FROM #DSECOMAINT A
		UNION
	 SELECT A.MS_MAY,A.TEN_MAY,'','',CASE WHEN (SELECT COUNT(*) FROM dbo.CAU_TRUC_THIET_BI_TS_GSTT T WHERE T.MS_MAY = A.MS_MAY) > 0 THEN 1 ELSE 0 END
	 FROM #MAY_USER A WHERE NOT EXISTS (SELECT * FROM #DSECOMAINT B WHERE A.MS_MAY = B.MS_MAY)
	  ORDER BY MS_MAY
 END
END

--IF(@sDanhMuc = 'GET_MYECOMAINT')
--BEGIN

--SELECT DISTINCT MS_MAY,TEN_MAY INTO #MAY_USER FROM [dbo].[MGetMayUserNgay](@DNgay,@UserName,@MsNXuong,-1,-1,@sCot1,'-1',-1,@NNgu)


--SELECT DISTINCT T1.MS_MAY,T2.TEN_MAY,CASE WHEN CONVERT(DATE,MAX(T1.NGAY_KT_KH)) < CONVERT(DATE,GETDATE()) THEN	1 ELSE 0 END TREBT,MIN(T1.MS_UU_TIEN) AS MUC_BT,
--0 AS HH_BT
--INTO #PBT FROM dbo.PHIEU_BAO_TRI T1 INNER JOIN #MAY_USER T2 ON T1.MS_MAY = T2.MS_MAY 
--WHERE (CONVERT(DATE, NGAY_BD_KH) BETWEEN DATEADD(YEAR,-1,@DNgay) AND CONVERT(DATE,@DNgay)) AND (TINH_TRANG_PBT =2) 
--GROUP BY T1.MS_MAY,T2.TEN_MAY,T1.MS_LOAI_BT


--UPDATE #PBT 
--SET HH_BT = (SELECT HU_HONG FROM dbo.LOAI_BAO_TRI WHERE MS_LOAI_BT = (SELECT TOP 1 MS_LOAI_BT FROM dbo.PHIEU_BAO_TRI WHERE MS_MAY = #PBT.MS_MAY ORDER BY MS_PHIEU_BAO_TRI DESC))


--SELECT DISTINCT MS_MAY,T1.TEN_MAY,CASE WHEN CONVERT(DATE,MAX(NGAY_KE)) < CONVERT(DATE,GETDATE()) THEN	1 ELSE 0 END TREGS, 0 AS MUC_GS,0 AS HH_GS
--INTO #GSTT FROM [dbo].[MGetHieuChuanKeGSTT](DATEADD(YEAR,-1,@DNgay),@DNgay,@UserName,@MsNXuong,-1,-1,@sCot1,'-1',-1,1,@NNgu) T1
--GROUP BY MS_MAY,TEN_MAY

----IF EXISTS(SELECT * FROM dbo.USER_CHUC_NANG WHERE STT = 14 AND USERNAME =@UserName)
----BEGIN
----SET @sCot3 = NULL;
----END
----ELSE
----BEGIN
----SET @sCot3 = '0';
----END

--SELECT DISTINCT B.MS_MAY,C.TEN_MAY,A.NGAY, CASE WHEN CONVERT(DATE, DATEADD(DAY,(SELECT TOP 1 T.SO_NGAY_PHAI_BD FROM dbo.MUC_UU_TIEN T WHERE T.MS_UU_TIEN = B.MS_UU_TIEN),A.NGAY)) < CONVERT(DATE,GETDATE()) THEN	1 ELSE 0 END  AS TREYC, B.MS_UU_TIEN AS MUC_YC, CASE ISNULL(B.USERNAME_DSX,'') WHEN '' THEN 0 ELSE 1 END AS HH_YC INTO #YC FROM  dbo.YEU_CAU_NSD A
--INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.STT = A.STT 
--INNER JOIN #MAY_USER C ON C.MS_MAY = B.MS_MAY 
--WHERE  (CONVERT(DATE,A.NGAY) BETWEEN DATEADD(YEAR,-1,GETDATE()) AND CONVERT(DATE,GETDATE())) AND (B.USERNAME_DSX IS NULL OR (B.USERNAME_DBT IS NULL AND B.THUC_HIEN_DSX = 1 ))

--SELECT DISTINCT T1.MS_MAY,T1.TEN_MAY,
--CASE WHEN ISNULL(T4.MS_MAY,'') = '' THEN 0 ELSE 1 END AS YC,
--CASE WHEN ISNULL(T2.MS_MAY,'') = '' THEN 0 ELSE 1 END AS PBT,
--CASE WHEN ISNULL(T3.MS_MAY,'') = '' THEN 0 ELSE 1 END AS GSTT,
--T4.TREYC,T2.TREBT,T3.TREGS,
--T4.MUC_YC,T2.MUC_BT,T3.MUC_GS,
--T4.HH_YC,T2.HH_BT,T3.HH_GS
--INTO #DSECOMAINT
--FROM (
--	SELECT MS_MAY,TEN_MAY FROM #GSTT 
--	UNION SELECT MS_MAY,TEN_MAY FROM #PBT
--	UNION SELECT MS_MAY,TEN_MAY FROM #YC
--) T1 
--LEFT JOIN  #PBT T2 ON T1.MS_MAY = T2.MS_MAY 
--LEFT JOIN #GSTT T3 ON T1.MS_MAY = T3.MS_MAY 
--LEFT JOIN #YC T4 ON T1.MS_MAY = T4.MS_MAY
-- --WHERE T1.MS_MAY = @deviceID OR @deviceID ='-1'
-- IF(@bcot1 = 1)
-- BEGIN
-- SELECT CN.MS_MAY,
--        CN.TEN_MAY,
--        CN.YC,
--        CN.PBT,
--        CN.GSTT,
--      ISNULL(CN.TREYC,0) TREYC,
--              ISNULL(CN.TREBT,0)  TREBT,
--              ISNULL(CN.TREGS,0)   TREGS,
--			  ISNULL(CN.MUC_YC,0) MUC_YC, ISNULL(CN.MUC_BT,0) MUC_BT,ISNULL(CN.MUC_GS,0)MUC_GS,ISNULL(CN.HH_YC,0)HH_YC,ISNULL(CN.HH_BT,0)HH_BT,ISNULL(CN.HH_GS,0)HH_GS  FROM #DSECOMAINT CN order by CN.MS_MAY
-- END
-- ELSE
-- BEGIN
-- ---lấy thêm những mấy chưa có
-- SELECT T.MS_MAY,
--        T.TEN_MAY,
--        T.YC,
--        T.PBT,
--        T.GSTT, 
--		ISNULL(TREYC,0) TREYC,
--              ISNULL(TREBT,0)  TREBT,
--              ISNULL(TREGS,0)  TREGS,
--			  ISNULL(T.MUC_YC,0) MUC_YC,ISNULL(T.MUC_BT,0) MUC_BT,ISNULL(T.MUC_GS,0)MUC_GS,
--			  ISNULL(T.HH_YC,0) HH_YC,ISNULL(T.HH_BT,0) HH_BT,ISNULL(T.HH_GS,0) HH_GS  FROM (
--		SELECT MS_MAY,
--               TEN_MAY,
--               YC,
--               PBT,
--               GSTT,
--               TREYC,
--               TREBT,
--               TREGS,MUC_YC,MUC_BT,MUC_GS,HH_YC,HH_BT,HH_GS FROM #DSECOMAINT
--		UNION
--	SELECT A.MS_MAY,A.TEN_MAY,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL FROM #MAY_USER A WHERE NOT EXISTS (SELECT * FROM #DSECOMAINT B WHERE A.MS_MAY = B.MS_MAY)
--	 ) AS  T  ORDER BY T.MS_MAY
-- END
--END
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
                        CASE @NNgu WHEN 0 THEN TEN_TS_GSTT WHEN 1 THEN ISNULL(NULLIF(TEN_TS_GSTT_ANH,''),TEN_TS_GSTT) ELSE ISNULL(NULLIF(TEN_TS_GSTT_HOA,''),TEN_TS_GSTT)  END AS  MonitoringParamsName ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT MonitoringParamsID ,
                        T.MS_BO_PHAN ComponentID ,
						CASE @NNgu WHEN 0 THEN T.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(T.TEN_BO_PHAN_ANH,''),T.TEN_BO_PHAN) ELSE ISNULL(NULLIF(T.TEN_BO_PHAN_HOA,''),T.TEN_BO_PHAN) END AS ComponentName,
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
                        CASE @NNgu WHEN 0 THEN TEN_TS_GSTT WHEN 1 THEN ISNULL(NULLIF(TEN_TS_GSTT_ANH,''),TEN_TS_GSTT) ELSE ISNULL(NULLIF(TEN_TS_GSTT_HOA,''),TEN_TS_GSTT)  END AS MonitoringParamsName ,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT MonitoringParamsID ,
                        T.MS_BO_PHAN ComponentID ,
                        CASE @NNgu WHEN 0 THEN T.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(T.TEN_BO_PHAN_ANH,''),T.TEN_BO_PHAN) ELSE ISNULL(NULLIF(T.TEN_BO_PHAN_HOA,''),T.TEN_BO_PHAN) END AS  ComponentName ,
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
                GROUP BY THONG_SO_GSTT.TEN_TS_GSTT ,TEN_TS_GSTT_ANH,TEN_TS_GSTT_HOA,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT ,
                        T.MS_BO_PHAN ,
                        T.TEN_BO_PHAN ,
						T.TEN_BO_PHAN_ANH,
						T.TEN_BO_PHAN_HOA,
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
                                A.Note,
								A.DUONG_DAN
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
                           REPLACE(DUONG_DAN,'27.74.240.29','192.168.2.8') AS DUONG_DAN
						   FROM #RESULST A ORDER BY TypeOfParam DESC, ComponentID
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
                        CASE @NNgu WHEN 0 THEN T.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(T.TEN_BO_PHAN_ANH,''),T.TEN_BO_PHAN) ELSE ISNULL(NULLIF(T.TEN_BO_PHAN_HOA,''),T.TEN_BO_PHAN) END AS  ComponentName ,
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
                       CASE @NNgu WHEN 0 THEN T.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(T.TEN_BO_PHAN_ANH,''),T.TEN_BO_PHAN) ELSE ISNULL(NULLIF(T.TEN_BO_PHAN_HOA,''),T.TEN_BO_PHAN) END AS  ComponentName ,
                        THONG_SO_GSTT.LOAI_TS TypeOfParam ,
                        ISNULL(T4.TEN_DV_DO, '') MeasurementUnitName ,
                        dbo.GetGiaTriThongSo(@deviceID, T.MS_BO_PHAN,CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT) ValueParamName ,
                        -1 Pass ,
                        CONVERT(FLOAT,null) as Measurement ,
                        -1 ValueParamID ,
                        '' Note, PATH_HD as DUONG_DAN
                FROM    THONG_SO_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI_TS_GSTT ON CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT = THONG_SO_GSTT.MS_TS_GSTT
                        INNER JOIN CAU_TRUC_THIET_BI T ON T.MS_MAY = CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY
                                                          AND T.MS_BO_PHAN = CAU_TRUC_THIET_BI_TS_GSTT.MS_BO_PHAN
						INNER JOIN #GS GS ON GS.MS_TS_GSTT = THONG_SO_GSTT.MS_TS_GSTT AND GS.MS_BO_PHAN = T.MS_BO_PHAN AND GS.MS_MAY = T.MS_MAY
                        LEFT JOIN dbo.DON_VI_DO AS T4 ON THONG_SO_GSTT.MS_DV_DO = T4.MS_DV_DO
					
                WHERE   ( CAU_TRUC_THIET_BI_TS_GSTT.MS_MAY = @deviceID )
                        AND THONG_SO_GSTT.LOAI_TS = 0
                        AND ACTIVE = 1 AND MS_LOAI_CV IN (SELECT MS_LOAI_CV FROM #LCV)
                GROUP BY THONG_SO_GSTT.TEN_TS_GSTT ,TEN_TS_GSTT_ANH,TEN_TS_GSTT_HOA,
                        CAU_TRUC_THIET_BI_TS_GSTT.MS_TS_GSTT ,
                        T.MS_BO_PHAN ,
                        T.TEN_BO_PHAN ,
						T.TEN_BO_PHAN_ANH,T.TEN_BO_PHAN_HOA,
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
                                REPLACE(DUONG_DAN,'27.74.240.29','192.168.2.8') AS DUONG_DAN
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

	    INSERT INTO dbo.GIAM_SAT_TINH_TRANG_TS( STT ,MS_MAY ,MS_TS_GSTT ,MS_BO_PHAN ,MS_TT ,THOI_GIAN ,TG_TT,GIA_TRI_DO)
		SELECT DISTINCT @stt,DeviceID,MonitoringParamsID ,ComponentID ,ID  ,B.THOI_GIAN,B.THOI_GIAN,Measurement  FROM #BTGS A
		INNER JOIN dbo.CAU_TRUC_THIET_BI_TS_GSTT B ON A.DeviceID = B.MS_MAY AND A.MonitoringParamsID =B.MS_TS_GSTT AND A.ComponentID = B.MS_BO_PHAN AND A.ID = B.MS_TT
		WHERE A.ID > 0
	
		INSERT INTO dbo.GIAM_SAT_TINH_TRANG_TS_DT( STT ,MS_MAY ,MS_TS_GSTT ,MS_BO_PHAN ,MS_TT ,STT_GT)
		SELECT DISTINCT @stt,DeviceID,MonitoringParamsID ,ComponentID ,ID,ValueParamID FROM #BTGS WHERE TypeOfParam = 1
		
		UPDATE A 
		SET A.NGAY_GS_CUOI = GETDATE()
		FROM dbo.CAU_TRUC_THIET_BI_TS_GSTT A
		INNER JOIN #BTGS B ON  B.DeviceID = A.MS_MAY AND B.MonitoringParamsID =A.MS_TS_GSTT AND B.ComponentID = A.MS_BO_PHAN
		WHERE B.ID > 0

		INSERT INTO dbo.GIAM_SAT_TINH_TRANG_HINH
		(STT,MS_MAY,MS_TS_GSTT,MS_BO_PHAN,MS_TT,DUONG_DAN,GHI_CHU)
		SELECT DISTINCT @stt,DeviceID,MonitoringParamsID ,ComponentID ,ID,REPLACE(DUONG_DAN,'192.168.2.8','27.74.240.29') , Note FROM #BTGS 

		SELECT TOP 1 @deviceID = MS_MAY FROM dbo.GIAM_SAT_TINH_TRANG_TS WHERE STT = @stt

		---kiểm tra có thông số không đạt không
		SELECT DISTINCT A.MS_BO_PHAN,C.TEN_TS_GSTT,D.TEN_GIA_TRI INTO #BTLYC FROM dbo.GIAM_SAT_TINH_TRANG_TS A
		INNER JOIN dbo.GIAM_SAT_TINH_TRANG_TS_DT B ON B.MS_TS_GSTT = A.MS_TS_GSTT
		INNER JOIN dbo.THONG_SO_GSTT C ON C.MS_TS_GSTT = A.MS_TS_GSTT
		INNER JOIN dbo.GIA_TRI_TS_GSTT D ON D.MS_TS_GSTT = C.MS_TS_GSTT AND D.STT = B.STT_GT
		WHERE DAT = 0 AND C.LOAI_TS = 1 AND A.STT = @stt
		UNION
		SELECT DISTINCT A.MS_BO_PHAN,B.TEN_TS_GSTT,C.TEN_GT + '(' + CONVERT(NVARCHAR(10),A.GIA_TRI_DO)  +' ' +D.TEN_DV_DO +')' FROM dbo.GIAM_SAT_TINH_TRANG_TS A
		INNER JOIN dbo.THONG_SO_GSTT B ON B.MS_TS_GSTT = A.MS_TS_GSTT
		INNER JOIN dbo.CAU_TRUC_THIET_BI_TS_GSTT C ON C.MS_MAY = A.MS_MAY AND C.MS_BO_PHAN = A.MS_BO_PHAN AND C.MS_TS_GSTT = A.MS_TS_GSTT AND C.MS_TT = A.MS_TT
		INNER JOIN dbo.DON_VI_DO D ON D.MS_DV_DO = B.MS_DV_DO
		WHERE B.LOAI_TS = 0  AND C.DAT = 0 AND A.STT = @stt
		ORDER BY A.MS_BO_PHAN,C.TEN_TS_GSTT

		IF EXISTS(SELECT * FROM #BTLYC)
		BEGIN
			INSERT INTO dbo.YEU_CAU_NSD(NGAY,GIO_YEU_CAU,NGUOI_YEU_CAU,USER_COMMENT,NGAY_HOAN_THANH,DA_KIEM_TRA,USER_LAP,EMAIL_NSD,SO_YEU_CAU,MS_YEU_CAU,MS_N_XUONG,DUYET)
			SELECT GETDATE(),GETDATE(),(SELECT TOP 1 B.HO + ' '+ B.TEN FROM dbo.USERS A INNER JOIN dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN WHERE A.USERNAME = @UserName),N'',DATEADD(DAY,(SELECT SO_NGAY_PHAI_BD FROM dbo.MUC_UU_TIEN WHERE MS_UU_TIEN = 2),GETDATE()),
			0,@UserName,'',dbo.AUTO_CREATE_SO_PHIEU_YC(GETDATE()),dbo.AUTO_CREATE_SO_PHIEU_YC(GETDATE()),(SELECT TOP 1 MS_N_XUONG FROM dbo.MAY_NHA_XUONG WHERE MS_MAY =@deviceID) ,0
			 FROM dbo.GIAM_SAT_TINH_TRANG WHERE STT = @stt
			SET @stt = SCOPE_IDENTITY()

			INSERT INTO dbo.YEU_CAU_NSD_CHI_TIET
			(STT,MS_MAY,MO_TA_TINH_TRANG,YEU_CAU,MS_CACH_TH,MS_PBT,MS_CONG_NHAN,USERNAME,MS_UU_TIEN,USERNAME_DSX,THOI_GIAN_DSX,Y_KIEN_DSX,THUC_HIEN_DSX,EMAIL_DSX,USERNAME_DBT,NGAY_DBT,Y_KIEN_DBT,EMAIL_DBT,NGAY_XAY_RA,GIO_XAY_RA,MS_LOAI_YEU_CAU_BT,MS_NGUYEN_NHAN)
			VALUES
			(   @stt,         -- STT - int
				@deviceID,       -- MS_MAY - nvarchar(30)
				(SELECT STUFF((SELECT ';+ ' + MS_BO_PHAN + ' ' + TEN_TS_GSTT + ' '+ TEN_GIA_TRI    FROM #BTLYC 
				FOR XML PATH(''), TYPE).value('.', 'nvarchar(max)'), 1, 1, '')),       -- MO_TA_TINH_TRANG - nvarchar(max)
				N'Từ giám sát tình trạng',       -- YEU_CAU - nvarchar(max)
				NULL,       -- MS_CACH_TH - nvarchar(15)
				NULL,       -- MS_PBT - nvarchar(20)
				NULL,       -- MS_CONG_NHAN - nvarchar(9)
				@UserName,       -- USERNAME - nvarchar(50)
				(SELECT TOP 1 MUC_UU_TIEN FROM dbo.MAY WHERE MS_MAY = @deviceID),         -- MS_UU_TIEN - int
				NULL,       -- USERNAME_DSX - nvarchar(50)
				NULL, -- THOI_GIAN_DSX - datetime
				NULL,       -- Y_KIEN_DSX - nvarchar(250)
				NULL,      -- THUC_HIEN_DSX - bit
				NULL,       -- EMAIL_DSX - nvarchar(250)
				NULL,       -- USERNAME_DBT - nvarchar(50)
				NULL, -- NGAY_DBT - datetime
				NULL,       -- Y_KIEN_DBT - nvarchar(250)
				NULL,       -- EMAIL_DBT - nvarchar(250)
				NULL, -- NGAY_XAY_RA - datetime
				NULL, -- GIO_XAY_RA - datetime
				2,         -- MS_LOAI_YEU_CAU_BT - int
				NULL        -- MS_NGUYEN_NHAN - int
				)
		
			SET @icot1 =(SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT =  13 AND USERNAME = @UserName)
			IF(@icot1 = 1)
			BEGIN
				UPDATE dbo.YEU_CAU_NSD_CHI_TIET
				SET USERNAME_DSX = @UserName,
				THOI_GIAN_DSX = GETDATE(),
				Y_KIEN_DSX = 'Auto',
				THUC_HIEN_DSX = 1
				WHERE STT =@stt AND MS_MAY = @deviceID
			END
		END
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
SELECT TOP 1 A.USERNAME AS UserName,D.HO + ' '+D.TEN  AS FullName,B.TEN_TO AS Department,C.GROUP_NAME AS [Group],A.USER_MAIL AS  Email,D.MS_CONG_NHAN  FROM dbo.USERS A
LEFT JOIN dbo.[TO_PHONG_BAN] B ON B.MS_TO = A.MS_TO
LEFT JOIN  dbo.NHOM C ON C.GROUP_ID = A.GROUP_ID
LEFT JOIN dbo.CONG_NHAN D ON D.MS_CONG_NHAN = A.MS_CONG_NHAN
WHERE A.USERNAME = @UserName
END
IF(@sDanhMuc ='GENERAL')
BEGIN

DECLARE @TEN_TO NVARCHAR(50) =''
DECLARE @TEN_DV NVARCHAR(50) =''
DECLARE @HO_TEN NVARCHAR(50) =''

SELECT @TEN_TO = C.TEN_TO,@TEN_DV = D.TEN_DON_VI ,@HO_TEN = (E.HO +' ' + E.TEN) FROM dbo.USERS A
INNER JOIN dbo.TO_PHONG_BAN C ON C.MS_TO = A.MS_TO
INNER JOIN dbo.DON_VI D ON D.MS_DON_VI = C.MS_DON_VI
LEFT JOIN dbo.CONG_NHAN E ON E.MS_CONG_NHAN = A.MS_CONG_NHAN
WHERE A.USERNAME =@UserName


SELECT TEN_CTY_TIENG_VIET AS TEN_CTY,TEN_NGAN_TIENG_VIET AS TEN_NGAN,DIA_CHI_VIET AS  DIA_CHI,Phone AS PHONE,@username,Fax AS FAX 
,@TEN_TO AS TEN_TO,@TEN_DV AS TEN_DV  ,@HO_TEN AS HO_TEN,REPLACE(DUONG_DAN_TL,'27.74.240.29','192.168.2.8') AS DUONG_DAN_TL
FROM dbo.THONG_TIN_CHUNG
END
IF(@sDanhMuc ='GetUserRequest')
BEGIN
---[spCMMSWEB]
IF(@stt = 1)
BEGIN
	SELECT  A.STT,B.MS_MAY,B.MO_TA_TINH_TRANG,B.YEU_CAU,B.MS_UU_TIEN,B.MS_NGUYEN_NHAN,A.NGAY,A.GIO_YEU_CAU,CASE WHEN B.THOI_GIAN_DSX IS NULL THEN 0 ELSE 1 END AS DUYET,
	CONVERT(NVARCHAR(5),A.GIO_YEU_CAU,108)  + ' ' + CONVERT(NVARCHAR(10),A.NGAY,105) + ' '+ A.NGUOI_YEU_CAU AS NGUOI_YEU_CAU,B.NGAY_XAY_RA,
	CASE ISNULL(B.NGAY_XAY_RA,'') WHEN '' THEN 0 ELSE 1 END AS HONG,
	(SELECT DUONG_DAN  FROM dbo.YEU_CAU_NSD_CHI_TIET_HINH  WHERE MS_MAY = @deviceID AND STT = A.STT  FOR JSON AUTO ) AS Files,B.USERNAME
	INTO #GETYCNSD
	FROM dbo.YEU_CAU_NSD A
	INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.STT = A.STT 
	WHERE B.MS_MAY =@deviceID AND (B.NGAY_DBT IS NULL OR B.THOI_GIAN_DSX IS NULL) AND A.MS_YEU_CAU = @sCot1
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
           REPLACE(Files,'27.74.240.29','192.168.2.8') AS Files,
           USERNAME,
		   CASE DUYET WHEN 0 THEN (SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT = 13 AND USERNAME =@UserName) ELSE (SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT = 14 AND USERNAME =@UserName) END AS QUYEN	
		   FROM #GETYCNSD 	ORDER BY GIO_YEU_CAU DESC
		   END
		   ELSE
           BEGIN
		   	SELECT -1 AS STT,
           @deviceID MS_MAY,
           NULL MO_TA_TINH_TRANG,
           NULL YEU_CAU,
           (SELECT TOP 1 MUC_UU_TIEN FROM dbo.MAY WHERE MS_MAY = @deviceID) MS_UU_TIEN,
           NULL MS_NGUYEN_NHAN,
           GETDATE() NGAY,
           GETDATE() GIO_YEU_CAU,
           NULL DUYET,
           NULL NGUOI_YEU_CAU,
           NULL NGAY_XAY_RA,
           NULL HONG,
           NULL AS Files,
           @UserName AS USERNAME,
		   1 AS QUYEN	

		   END

END

IF(@sDanhMuc ='GetList_Image_UserRequest')
BEGIN
	SELECT REPLACE(DUONG_DAN,'27.74.240.29','192.168.2.8') AS  DUONG_DAN  FROM dbo.YEU_CAU_NSD_CHI_TIET_HINH  WHERE MS_MAY = @deviceID AND STT = @icot1  FOR JSON AUTO
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
		    MS_N_XUONG,
			DUYET
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
		    ,1)
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
			SELECT @stt,@deviceID,@stt1, REPLACE(DUONG_DAN,'192.168.2.8','27.74.240.29')  FROM #BTHINH

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

				--gửi thông báo
				EXEC dbo.spSentThongBao @ID = @stt,          -- bigint
				                        @UName = @UserName,     -- nvarchar(50)
				                        @TableName = N'YEU_CAU_NSD', -- nvarchar(50)
				                        @sCot1 = N'',     -- nvarchar(50)
				                        @sCot2 = N'',     -- nvarchar(50)
				                        @sCot3 = N''      -- nvarchar(50)
				

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


IF(@sDanhMuc ='CAP_NHAT_DUYET_USEREQUEST')
BEGIN

		BEGIN TRANSACTION UpCND
		BEGIN TRY

		IF(@icot1 = 1)
		BEGIN
			--không duyệt
				UPDATE dbo.YEU_CAU_NSD_CHI_TIET
				SET USERNAME_DSX = @UserName,
				THOI_GIAN_DSX = GETDATE(),
				Y_KIEN_DSX = @sCot1,
				THUC_HIEN_DSX = 0
				WHERE STT =@stt AND MS_MAY = @deviceID
		END
		IF(@icot1 = 2)
		BEGIN
			    --duyệt
				UPDATE dbo.YEU_CAU_NSD_CHI_TIET
				SET USERNAME_DSX = @UserName,
				THOI_GIAN_DSX = GETDATE(),
				Y_KIEN_DSX = @sCot1,
				THUC_HIEN_DSX = 1
				WHERE STT =@stt AND MS_MAY = @deviceID

		END

		IF(@icot1 = 3)
		BEGIN
			    --duyệt
				UPDATE dbo.YEU_CAU_NSD_CHI_TIET SET NGAY_DBT = GETDATE(),USERNAME_DBT = @UserName,Y_KIEN_DBT = @sCot1,MS_CACH_TH ='03' WHERE STT=@stt AND MS_MAY = @deviceID
		END

				



		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		COMMIT TRANSACTION UpCND
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION UpCND;   
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

		SELECT  MS_PHIEU_BAO_TRI,NGAY_KT_KH,MS_LOAI_BT,A.MS_UU_TIEN, B.MO_TA_TINH_TRANG AS N'TINH_TRANG_MAY',A.USERNAME_NGUOI_LAP AS USERNAME,(SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT = 7 AND USERNAME = @UserName) AS QUYEN,A.GHI_CHU, 0 AS THEM
		FROM dbo.PHIEU_BAO_TRI A
		LEFT JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON A.MS_PHIEU_BAO_TRI = B.MS_PBT
		WHERE A.MS_MAY = @deviceID AND A.MS_PHIEU_BAO_TRI = @sCot1 AND A.TINH_TRANG_PBT  = 2 ORDER BY MS_PHIEU_BAO_TRI DESC

	END
	ELSE
    BEGIN
		SELECT dbo.AUTO_CREATE_SO_PHIEU_BT(GETDATE()) MS_PHIEU_BAO_TRI,GETDATE() AS NGAY_KT_KH,NULL MS_LOAI_BT,NULL MS_UU_TIEN, NULL AS N'TINH_TRANG_MAY', @UserName AS USERNAME,(SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT = 7 AND USERNAME = @UserName) AS QUYEN ,'' AS  LY_DO_BT , 1 AS THEM
	END
END

IF(@sDanhMuc = 'GET_WORDORDER_BY_MSBT')
BEGIN 
	
		SELECT TOP 1  MS_PHIEU_BAO_TRI,NGAY_KT_KH,MS_LOAI_BT,A.MS_UU_TIEN, B.MO_TA_TINH_TRANG AS N'TINH_TRANG_MAY',@UserName AS USERNAME,(SELECT COUNT(*) FROM dbo.USER_CHUC_NANG WHERE STT = 7 AND USERNAME = @UserName) AS QUYEN,A.GHI_CHU, 0 AS THEM
		FROM dbo.PHIEU_BAO_TRI A
		LEFT JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON A.MS_PHIEU_BAO_TRI = B.MS_PBT
		WHERE A.MS_PHIEU_BAO_TRI = @sCot1

		IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI A INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON A.MS_PHIEU_BAO_TRI = B.MS_PBT AND A.MS_PHIEU_BAO_TRI = @sCot1 AND ISNULL(B.NGAY_XAY_RA,'') !='')
			BEGIN
			     
				 EXEC dbo.spSentThongBao @ID = 0,          -- bigint
				                         @UName = @UserName,     -- nvarchar(50)
				                         @TableName = N'NGUOI_CO_TRACH_NHIEM', -- nvarchar(50)
				                         @sCot1 = @sCot1,     -- nvarchar(50)
				                         @sCot2 = N'',     -- nvarchar(50)
				                         @sCot3 = N''      -- nvarchar(50)
			END
	
END


IF(@sDanhMuc ='SAVE_WORDORDER')
BEGIN
	BEGIN TRANSACTION UpPBT
	BEGIN TRY


	--IF NOT EXISTS (SELECT * FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1)
	IF @iCot3  = 1
	BEGIN
	DECLARE @MS_YC NVARCHAR(50)
	IF(ISNULL(@sCot3,'') != '')
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

	IF  EXISTS (SELECT * FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1)
	BEGIN
	 SET @sCot1 = dbo.AUTO_CREATE_SO_PHIEU_BT(GETDATE());
	END

	SELECT TOP 1 @MS_TT_CT = MS_TT_CT FROM TINH_TRANG_PBT_CT WHERE STT = (@icot3 + 1) AND MAC_DINH = 1
	INSERT INTO dbo.PHIEU_BAO_TRI(MS_PHIEU_BAO_TRI,TINH_TRANG_PBT,MS_MAY,MS_LOAI_BT,NGAY_LAP,GIO_LAP,GHI_CHU,MS_UU_TIEN,NGAY_BD_KH,NGAY_KT_KH,NGUOI_LAP,USERNAME_NGUOI_LAP,SO_PHIEU_BAO_TRI,MS_TT_CT,UPDATE_NGAY_CUOI,STT_CA)
	VALUES(@sCot1,@icot3 + 1,@deviceID,@icot1,CONVERT(DATE,GETDATE()),GETDATE(),@sCot4,@icot2,GETDATE(),@dCot1,(SELECT MS_CONG_NHAN FROM dbo.USERS WHERE USERNAME = @UserName),@UserName,@sCot1,@MS_TT_CT,GETDATE(),-1)
	END
	ELSE
	BEGIN
		UPDATE dbo.PHIEU_BAO_TRI SET GHI_CHU = @sCot4 WHERE MS_PHIEU_BAO_TRI = @sCot1
	END
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
		SELECT DISTINCT A.MS_PHIEU_BAO_TRI,A.MS_BO_PHAN,
		CASE @NNgu WHEN 0 THEN C.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(C.TEN_BO_PHAN_ANH,''),C.TEN_BO_PHAN) ELSE ISNULL(NULLIF(C.TEN_BO_PHAN_HOA,''),C.TEN_BO_PHAN) END AS  TEN_BO_PHAN ,
		A.MS_CV,
		CASE @NNgu WHEN 0 THEN D.MO_TA_CV WHEN 1 THEN ISNULL(NULLIF(D.MO_TA_CV_ANH,''),D.MO_TA_CV) ELSE ISNULL(NULLIF(D.MO_TA_CV_HOA,''),D.MO_TA_CV) END AS MO_TA_CV,
		CTTBCV.THAO_TAC,CTTBCV.TIEU_CHUAN_KT,CTTBCV.YEU_CAU_NS,CTTBCV.YEU_CAU_DUNG_CU,
		B.MS_PT,E.TEN_PT,F.MS_VI_TRI_PT,
		(SELECT TOP 1 SO_LUONG FROM dbo.CAU_TRUC_THIET_BI_PHU_TUNG WHERE MS_MAY = @deviceID AND MS_BO_PHAN = A.MS_BO_PHAN AND MS_PT = B.MS_PT) AS SL_CT,B.SL_KH,
		B.SL_TT ,REPLACE(CTTBCV.PATH_HD,'27.74.240.29','192.168.2.8') AS PATH_HD
		FROM dbo.PHIEU_BAO_TRI_CONG_VIEC A
		LEFT JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI AND B.MS_CV = A.MS_CV AND B.MS_BO_PHAN = A.MS_BO_PHAN
		LEFT JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET F ON F.MS_PHIEU_BAO_TRI = B.MS_PHIEU_BAO_TRI AND F.MS_CV = B.MS_CV AND F.MS_PT = B.MS_PT AND F.MS_BO_PHAN = B.MS_BO_PHAN
		INNER JOIN dbo.CAU_TRUC_THIET_BI C ON C.MS_BO_PHAN = A.MS_BO_PHAN AND C.MS_MAY = @deviceID
		INNER JOIN dbo.CAU_TRUC_THIET_BI_CONG_VIEC CTTBCV ON CTTBCV.MS_MAY = C.MS_MAY AND CTTBCV.MS_BO_PHAN = C.MS_BO_PHAN AND CTTBCV.MS_CV = A.MS_CV
		INNER JOIN dbo.CONG_VIEC D ON D.MS_CV = A.MS_CV
		LEFT JOIN dbo.IC_PHU_TUNG E ON E.MS_PT = B.MS_PT
		WHERE A.MS_PHIEU_BAO_TRI = @sCot1 AND C.MS_MAY = @deviceID
	END
IF(@sDanhMuc ='GET_LIST_JOB')
BEGIN
	SELECT A.MS_BO_PHAN,
	CASE @NNgu WHEN 0 THEN B.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(B.TEN_BO_PHAN_ANH,''),B.TEN_BO_PHAN) ELSE ISNULL(NULLIF(B.TEN_BO_PHAN_HOA,''),B.TEN_BO_PHAN) END AS  TEN_BO_PHAN ,
	A.MS_CV,
	CASE @NNgu WHEN 0 THEN C.MO_TA_CV WHEN 1 THEN ISNULL(NULLIF(C.MO_TA_CV_ANH,''),C.MO_TA_CV) ELSE ISNULL(NULLIF(C.MO_TA_CV_HOA,''),C.MO_TA_CV) END AS MO_TA_CV
	FROM dbo.CAU_TRUC_THIET_BI_CONG_VIEC A
	INNER JOIN dbo.CAU_TRUC_THIET_BI B ON B.MS_MAY = A.MS_MAY AND B.MS_BO_PHAN = A.MS_BO_PHAN
	INNER JOIN dbo.CONG_VIEC C ON C.MS_CV = A.MS_CV
	WHERE A.MS_MAY = @deviceID AND A.ACTIVE = 1 AND NOT EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC D WHERE D.MS_PHIEU_BAO_TRI =@sCot1 AND D.MS_CV = A.MS_CV AND D.MS_BO_PHAN = A.MS_BO_PHAN)
END



IF(@sDanhMuc ='GET_NGUOI_THUC_HIEN')
BEGIN
	
	SELECT DISTINCT B.MS_CONG_NHAN,C.HO + ' ' + C.TEN AS HO_TEN, CONVERT(BIT,0)AS CHON, CONVERT(BIT,1)AS XOA
	INTO #GETNTH
	FROM dbo.USERS B 
	INNER JOIN dbo.TO_PHONG_BAN E ON E.MS_TO = B.MS_TO
	INNER JOIN dbo.CONG_NHAN C ON C.MS_CONG_NHAN = B.MS_CONG_NHAN
	INNER JOIN dbo.CONG_NHAN_VAI_TRO D ON D.MS_CONG_NHAN = C.MS_CONG_NHAN
	WHERE E.MS_DON_VI IN (
	SELECT A.MS_DON_VI FROM dbo.DON_VI A
	INNER JOIN dbo.NHA_XUONG B ON B.MS_DON_VI = A.MS_DON_VI
	INNER JOIN dbo.MAY_NHA_XUONG C ON C.MS_N_XUONG = B.MS_N_XUONG
	WHERE C.MS_MAY =@deviceID
	) AND D.MS_VAI_TRO = 6 AND C.BO_VIEC = 0
	
	--SELECT DISTINCT B.MS_CONG_NHAN,C.HO + ' ' + C.TEN AS HO_TEN, CONVERT(BIT,0)AS CHON, CONVERT(BIT,1)AS XOA
	--INTO #GETNTH
	--FROM dbo.NHOM_NHA_XUONG A
	--INNER JOIN dbo.USERS B ON B.GROUP_ID = A.GROUP_ID
	--INNER JOIN dbo.CONG_NHAN C ON C.MS_CONG_NHAN = B.MS_CONG_NHAN
	--INNER JOIN dbo.CONG_NHAN_VAI_TRO D ON D.MS_CONG_NHAN = C.MS_CONG_NHAN
	--WHERE MS_N_XUONG IN ( SELECT T.MS_N_XUONG FROM [MGetUserMayNXCha]((SELECT MS_N_XUONG FROM dbo.MAY_NHA_XUONG WHERE MS_MAY =@deviceID),@UserName,GETDATE()) T)
	--AND D.MS_VAI_TRO IN(6)
	--AND B.USERNAME IN(
	--SELECT B.USERNAME FROM dbo.NHOM_LOAI_MAY A
	--INNER JOIN dbo.USERS B ON B.GROUP_ID = A.GROUP_ID
	--WHERE MS_LOAI_MAY = (SELECT dbo.MGetLoaiMay(@deviceID)))
	--spCMMSWEB #GETNTH
	UPDATE A
	SET A.CHON = 1,
	A.XOA =  CASE ISNULL(B.NGAY,'') WHEN '' THEN 1 ELSE 0 END
	FROM #GETNTH A
	INNER JOIN dbo.PHIEU_BAO_TRI_NHAN_SU B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN 
	WHERE B.MS_PHIEU_BAO_TRI = @sCot1

	SELECT DISTINCT MS_CONG_NHAN,
           HO_TEN AS TEN_CONG_NHAN,
           CHON,XOA FROM #GETNTH
	UNION 
	SELECT A.MS_CONG_NHAN,B.HO +  ' ' + B.TEN, CONVERT(BIT,1) AS CHON, CASE ISNULL(A.NGAY,'') WHEN '' THEN 1 ELSE 0 END FROM dbo.PHIEU_BAO_TRI_NHAN_SU A
	INNER JOIN  dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN
	WHERE NOT EXISTS(SELECT * FROM #GETNTH C WHERE A.MS_CONG_NHAN = C.MS_CONG_NHAN) AND a.MS_PHIEU_BAO_TRI = @sCot1
	ORDER BY CHON DESC,MS_CONG_NHAN

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

IF(@sDanhMuc ='SAVE_NGUOI_THU_HIEN')
BEGIN
	BEGIN TRANSACTION UpNguoiTH
	BEGIN TRY
	
	SELECT DISTINCT MS_CONG_NHAN INTO #NGUOITH FROM OPENJSON(@json) 
	WITH (MS_CONG_NHAN NVARCHAR(50) '$.MS_CONG_NHAN');

	--kiểm tra phiếu bảo tri có tồn tại trong yêu cầu có hư hỏng
	IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI A INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON A.MS_PHIEU_BAO_TRI = B.MS_PBT AND A.MS_PHIEU_BAO_TRI = @sCot1 AND ISNULL(B.NGAY_XAY_RA,'') !='')
	BEGIN
		--lấy những công nhân chọn không tồn tại trong bảng đã có
		SELECT ROW_NUMBER() OVER(ORDER BY MS_CONG_NHAN) AS ID ,MS_CONG_NHAN INTO #NGUOITB FROM #NGUOITH A
		WHERE NOT EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_NHAN_SU B WHERE A.MS_CONG_NHAN = B.MS_CONG_NHAN AND B.MS_PHIEU_BAO_TRI = @sCot1)
		--duyệt qua bảng công nhân
		DECLARE @rownum INT = 1, @totalrows INT
		SELECT @totalrows = COUNT(*) FROM #NGUOITB
		WHILE @rownum <= @totalrows
		BEGIN
		--spcmmsweb
		SET @sCot2 = (SELECT TOP 1 B.USERNAME FROM #NGUOITB A INNER JOIN  dbo.USERS B ON A.MS_CONG_NHAN = B.MS_CONG_NHAN WHERE ID = @rownum)
			EXEC dbo.spSentThongBao @ID = 0,          -- bigint
			@UName = @sCot2,     -- nvarchar(50)
			@TableName = N'NGUOI_DUOC_GIAO_BAO_TRI', -- nvarchar(50)
			@sCot1 = @sCot1,     -- nvarchar(50)
			@sCot2 = N'',     -- nvarchar(50)
			@sCot3 = N''      -- nvarchar(50)
			SET @rownum = @rownum + 1
		END
	END
	DELETE dbo.PHIEU_BAO_TRI_NHAN_SU WHERE MS_PHIEU_BAO_TRI = @sCot1 AND NGAY IS NULL

	INSERT INTO dbo.PHIEU_BAO_TRI_NHAN_SU
	(
	    MS_PHIEU_BAO_TRI,
	    MS_CONG_NHAN)
		SELECT @sCot1,MS_CONG_NHAN FROM #NGUOITH
	
	
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]

	COMMIT TRANSACTION UpNguoiTH
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION UpNguoiTH;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
END

IF(@sDanhMuc ='THEM_CAU_TRUC_CONG_VIEC')
BEGIN
	BEGIN TRANSACTION UpCauTrucCV
	BEGIN TRY
	
	IF(@bcot1 = 1)
	BEGIN
	 --thêm mới công việc và cấu trúc
	 SET @icot1 = (SELECT MAX(MS_CV) + 1 FROM dbo.CONG_VIEC)
	 INSERT INTO dbo.CONG_VIEC(MS_CV,MA_CV,KY_HIEU_CV,MS_LOAI_CV,MO_TA_CV,MO_TA_CV_ANH,MO_TA_CV_HOA,PATH_HD,MS_LOAI_MAY,THOI_GIAN_DU_KIEN,THAO_TAC,TIEU_CHUAN_KT,
	 GHI_CHU,MS_CHUYEN_MON,MS_BAC_THO,AN_TOAN,DINH_MUC,NGOAI_TE,SO_NGUOI,YEU_CAU_NS,YEU_CAU_DUNG_CU)
	 VALUES
	 (   @icot1,    -- MS_CV - int
	     @icot1,  -- MA_CV - nvarchar(100)
	     N'',  -- KY_HIEU_CV - nvarchar(100)
	     4,    -- MS_LOAI_CV - smallint
	     @sCot2,  -- MO_TA_CV - nvarchar(255)
	     @sCot2,  -- MO_TA_CV_ANH - nvarchar(255)
	     @sCot2,  -- MO_TA_CV_HOA - nvarchar(255)
	     N'',  -- PATH_HD - nvarchar(250)
	     dbo.MGetLoaiMay(@deviceID),  -- MS_LOAI_MAY - nvarchar(20)
	     @icot2,  -- THOI_GIAN_DU_KIEN - real
	     N'',  -- THAO_TAC - nvarchar(2000)
	     N'',  -- TIEU_CHUAN_KT - nvarchar(2000)
	     N'',  -- GHI_CHU - nvarchar(2000)
	     NULL,    -- MS_CHUYEN_MON - int
	     NULL,    -- MS_BAC_THO - int
	     0, -- AN_TOAN - bit
	     0.0,  -- DINH_MUC - float
	     N'',  -- NGOAI_TE - nvarchar(6)
	     0,    -- SO_NGUOI - int
	     N'',  -- YEU_CAU_NS - nvarchar(1000)
	     N''   -- YEU_CAU_DUNG_CU - nvarchar(1000)
	     )

		INSERT INTO dbo.CAU_TRUC_THIET_BI_CONG_VIEC(MS_MAY,MS_BO_PHAN,MS_CV,GHI_CHU,ACTIVE,TG_KH,THAO_TAC,TIEU_CHUAN_KT,YEU_CAU_NS,YEU_CAU_DUNG_CU,PATH_HD)
		VALUES
		(   @deviceID,  -- MS_MAY - nvarchar(30)
		    @sCot1,  -- MS_BO_PHAN - nvarchar(50)
		    @icot1,    -- MS_CV - int
		    N'',  -- GHI_CHU - nvarchar(250)
		    1, -- ACTIVE - bit
		    @icot2,  -- TG_KH - float
		    N'',  -- THAO_TAC - nvarchar(2000)
		    N'',  -- TIEU_CHUAN_KT - nvarchar(2000)
		    N'',  -- YEU_CAU_NS - nvarchar(1000)
		    N'',  -- YEU_CAU_DUNG_CU - nvarchar(1000)
		    N''   -- PATH_HD - nvarchar(500)
		    )
	END
	ELSE
    BEGIN
		
		INSERT INTO dbo.CAU_TRUC_THIET_BI_CONG_VIEC(MS_MAY,MS_BO_PHAN,MS_CV,GHI_CHU,ACTIVE,TG_KH,THAO_TAC,TIEU_CHUAN_KT,YEU_CAU_NS,YEU_CAU_DUNG_CU,PATH_HD)
		VALUES
		(   @deviceID,  -- MS_MAY - nvarchar(30)
		    @sCot1,  -- MS_BO_PHAN - nvarchar(50)
		    @icot1,    -- MS_CV - int
		    N'',  -- GHI_CHU - nvarchar(250)
		    1, -- ACTIVE - bit
		    @icot2,  -- TG_KH - float
		    N'',  -- THAO_TAC - nvarchar(2000)
		    N'',  -- TIEU_CHUAN_KT - nvarchar(2000)
		    N'',  -- YEU_CAU_NS - nvarchar(1000)
		    N'',  -- YEU_CAU_DUNG_CU - nvarchar(1000)
		    N''   -- PATH_HD - nvarchar(500)
		    )
	END
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]

	COMMIT TRANSACTION UpCauTrucCV
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION UpCauTrucCV;   
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

		
		SELECT DISTINCT MS_PT,TEN_PT,MS_VI_TRI_PT,SL_KH,SL_TT INTO #BTPT FROM OPENJSON(NULLIF(@json, 'null')) 
		WITH (MS_PT NVARCHAR(25) '$.MS_PT',TEN_PT NVARCHAR(250) '$.TEN_PT',MS_VI_TRI_PT NVARCHAR(250) '$.MS_VI_TRI_PT', SL_KH FLOAT '$.SL_KH', SL_TT FLOAT '$.SL_TT');
		--
		--update lại số lượng thực tế với cái nào đã tồn tại
		--UPDATE A
		--SET A.SL_TT = B.SL_TT,
		--A.SL_KH = B.SL_KH
		--FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG A
		--INNER JOIN #BTPT B ON A.MS_PHIEU_BAO_TRI = @sCot1 AND A.MS_BO_PHAN = @sCot2 AND A.MS_CV = @icot1 AND A.MS_PT =  B.MS_PT


		--UPDATE A
		--SET A.SL_TT = B.SL_TT,
		--A.SL_KH = B.SL_KH
		--FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET A
		--INNER JOIN #BTPT B ON A.MS_PHIEU_BAO_TRI = @sCot1 AND A.MS_BO_PHAN = @sCot2 AND A.MS_CV = @icot1 AND A.MS_PT =  B.MS_PT AND A.MS_VI_TRI_PT = B.MS_VI_TRI_PT


		DELETE PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1
		DELETE PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG WHERE MS_PHIEU_BAO_TRI = @sCot1

		INSERT INTO dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG(MS_PHIEU_BAO_TRI,MS_CV,MS_BO_PHAN,MS_PT,SL_KH,SL_TT)
		SELECT @sCot1,@icot1,@sCot2,A.MS_PT,A.SL_KH,A.SL_TT FROM #BTPT A
		LEFT JOIN (SELECT * FROM dbo.CAU_TRUC_THIET_BI_PHU_TUNG WHERE MS_MAY = @deviceID AND MS_BO_PHAN = @sCot2)B ON A.MS_PT = B.MS_PT
		WHERE NOT EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG  C WHERE C.MS_PHIEU_BAO_TRI = @sCot1 AND C.MS_BO_PHAN = @sCot2 AND C.MS_CV = @icot1 AND C.MS_PT =  A.MS_PT)

		INSERT INTO dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET(MS_PHIEU_BAO_TRI,MS_CV,MS_BO_PHAN,MS_PT,MS_VI_TRI_PT,SL_KH,SL_TT,VICT_NHA_THAU,NGUOI_THAY_THE)
		SELECT @sCot1,@icot1,@sCot2,A.MS_PT,A.MS_VI_TRI_PT,A.SL_KH,A.SL_TT,0,(SELECT TOP 1 ISNULL(MS_CONG_NHAN,@UserName) FROM dbo.USERS WHERE USERNAME = @UserName) FROM #BTPT A
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
	SELECT MS_CONG_NHAN,TU_GIO,NGAY,DEN_GIO,DEN_NGAY,SO_GIO  FROM dbo.PHIEU_BAO_TRI_NHAN_SU WHERE MS_PHIEU_BAO_TRI = @sCot1  AND TU_GIO IS NOT NULL
	--AND MS_CONG_NHAN = (SELECT ISNULL(MS_CONG_NHAN,@UserName) FROM dbo.USERS WHERE USERNAME = @UserName) AND NGAY IS NOT NULL
END
IF(@sDanhMuc ='SAVE_LIST_WORKING_TIME')
BEGIN
		BEGIN TRANSACTION UpWoking
		BEGIN TRY

		SELECT DISTINCT MS_CONG_NHAN,TU_GIO,NGAY,DEN_GIO,DEN_NGAY,SO_GIO INTO #BTWOK FROM OPENJSON(@json) 
		WITH (MS_CONG_NHAN NVARCHAR(9) '$.MS_CONG_NHAN',TU_GIO DATETIME '$.TU_GIO',NGAY DATETIME '$.NGAY',DEN_GIO DATETIME '$.DEN_GIO', DEN_NGAY DATETIME '$.DEN_NGAY', SO_GIO FLOAT '$.SO_GIO');
		
		--update lại số lượng thực tế với cái nào đã tồn tại
		DELETE dbo.PHIEU_BAO_TRI_NHAN_SU where MS_PHIEU_BAO_TRI = @sCot1 AND NGAY IS NOT NULL 

		DELETE dbo.PHIEU_BAO_TRI_NHAN_SU where MS_PHIEU_BAO_TRI = @sCot1 AND NGAY IS NULL AND MS_CONG_NHAN IN (SELECT MS_CONG_NHAN FROM #BTWOK)


		INSERT INTO dbo.PHIEU_BAO_TRI_NHAN_SU(MS_PHIEU_BAO_TRI,MS_CONG_NHAN,NGAY,TU_GIO,DEN_NGAY,DEN_GIO,HOAN_THANH,SO_GIO)	
		SELECT @sCot1,MS_CONG_NHAN,NGAY,NGAY,DEN_NGAY,DEN_NGAY,0,DATEDIFF(MINUTE,NGAY,DEN_NGAY) FROM #BTWOK
	
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

	SELECT DISTINCT A.MS_MAY,A.MS_BO_PHAN,
	CASE @NNgu WHEN 0 THEN A.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(A.TEN_BO_PHAN_ANH,''),A.TEN_BO_PHAN) ELSE ISNULL(NULLIF(A.TEN_BO_PHAN_HOA,''),A.TEN_BO_PHAN) END AS  TEN_BO_PHAN ,
	B.CLASS_ID,B.CLASS_CODE,B.CLASS_NAME,(SELECT COUNT(*) FROM #CLASS WHERE MS_BO_PHAN = A.MS_BO_PHAN AND CLASS_ID = B.CLASS_ID) AS GR_CLASS,
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
	SELECT DISTINCT A.MS_MAY,A.MS_BO_PHAN,
	CASE @NNgu WHEN 0 THEN A.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(A.TEN_BO_PHAN_ANH,''),A.TEN_BO_PHAN) ELSE ISNULL(NULLIF(A.TEN_BO_PHAN_HOA,''),A.TEN_BO_PHAN) END AS  TEN_BO_PHAN ,
	B.CLASS_ID,B.CLASS_CODE,B.CLASS_NAME,0 AS GR_CLASS,
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

IF @sDanhMuc = 'GET_COMBO_BO_PHAN'
BEGIN
		SELECT DISTINCT A.MS_BO_PHAN AS MA_BP,A.MS_BO_PHAN + ' ' +
		CASE @NNgu WHEN 0 THEN A.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(A.TEN_BO_PHAN_ANH,''),A.TEN_BO_PHAN) ELSE ISNULL(NULLIF(A.TEN_BO_PHAN_HOA,''),A.TEN_BO_PHAN) END AS TEN_BP
		FROM dbo.CAU_TRUC_THIET_BI A
		WHERE a.MS_MAY = @deviceID
		ORDER BY A.MS_BO_PHAN
END


IF @sDanhMuc = 'GET_COMBO_CONG_VIEC'
BEGIN
		SELECT MS_CV,
		CASE 0 WHEN 0 THEN MO_TA_CV WHEN 1 THEN ISNULL(NULLIF(MO_TA_CV_ANH,''),MO_TA_CV) ELSE ISNULL(NULLIF(MO_TA_CV_HOA,''),MO_TA_CV) END AS MO_TA_CV
		FROM dbo.CONG_VIEC A
		WHERE NOT EXISTS(SELECT * FROM dbo.CAU_TRUC_THIET_BI_CONG_VIEC C INNER JOIN  dbo.CONG_VIEC B ON B.MS_CV = C.MS_CV WHERE A.MS_CV = B.MS_CV AND A.MO_TA_CV = B.MO_TA_CV AND C.MS_BO_PHAN = @sCot1 AND C.MS_MAY = @deviceID)
		ORDER BY MO_TA_CV
END


IF @sDanhMuc = 'HISTORY'
BEGIN
	IF @iLoai = 0 -- load combo bộ phận
	BEGIN
		
		SELECT DISTINCT B.MS_BO_PHAN AS MA_BP,B.MS_BO_PHAN + ' ' +
		CASE @NNgu WHEN 0 THEN C.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(C.TEN_BO_PHAN_ANH,''),C.TEN_BO_PHAN) ELSE ISNULL(NULLIF(C.TEN_BO_PHAN_HOA,''),C.TEN_BO_PHAN) END AS TEN_BP
		FROM dbo.PHIEU_BAO_TRI A
		INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI AND a.MS_MAY = @deviceID
		INNER JOIN dbo.CAU_TRUC_THIET_BI C ON C.MS_BO_PHAN = B.MS_BO_PHAN AND C.MS_MAY = @deviceID WHERE A.MS_MAY = @deviceID AND B.SL_TT > 0 AND A.TINH_TRANG_PBT > 2
		UNION
		SELECT '-1', '< All >' WHERE @CoAll = 1
		ORDER BY TEN_BP
	END

	IF @iLoai = 1 -- Loadcbo phụ tùng
	BEGIN

	SELECT DISTINCT B.MS_PT,
	B.MS_PT +' '+ CASE @NNgu WHEN 0 THEN C.TEN_PT WHEN 1 THEN ISNULL(NULLIF(C.TEN_PT_ANH,''),C.TEN_PT) ELSE ISNULL(NULLIF(C.TEN_PT_HOA,''),C.TEN_PT) END AS TEN_PT
	FROM dbo.PHIEU_BAO_TRI A
		INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI AND a.MS_MAY = @deviceID
		INNER JOIN dbo.IC_PHU_TUNG C ON C.MS_PT = B.MS_PT WHERE A.MS_MAY = @deviceID AND B.SL_TT > 0 AND A.TINH_TRANG_PBT > 2 AND (B.MS_BO_PHAN  = @sCot1 OR @sCot1 = '-1')
		UNION
		SELECT '-1' , '< All >' WHERE @CoAll = 1
		ORDER BY TEN_PT
	END

	IF @iLoai = 2 -- LOAD LƯỚI
	BEGIN
		IF(@bcot1 = 0)
		BEGIN
		SELECT T.LOAI,
               T.NGAY,
               T.MA_BP,
               T.MA_PT,
               T.SL_THAY_THE FROM (
			SELECT 1 AS LOAI, CONVERT(NVARCHAR(10),A.NGAY_LAP,4) AS NGAY,B.MS_BO_PHAN AS MA_BP,CASE @NNgu WHEN 0 THEN C.MO_TA_CV WHEN 1 THEN ISNULL(NULLIF(C.MO_TA_CV_ANH,''),C.MO_TA_CV) ELSE ISNULL(NULLIF(C.MO_TA_CV_HOA,''),C.MO_TA_CV) END AS MA_PT ,NULL AS SL_THAY_THE,
			A.NGAY_LAP AS NGAY_SORT
			FROM dbo.PHIEU_BAO_TRI A
			INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI
			INNER JOIN dbo.CONG_VIEC C ON C.MS_CV = B.MS_CV
			WHERE A.MS_MAY = @deviceID AND CONVERT(DATE,A.NGAY_LAP) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2) AND A.TINH_TRANG_PBT > 2
			UNION
			SELECT 3 AS LOAI, CONVERT(NVARCHAR(10),A.NGAY_HC,4) AS NGAY,A.MS_MAY,REPLACE(B.TEN_LOAI_HIEU_CHUAN,'hiệu chuẩn','HC') AS MA_PT, NULL,
			A.NGAY_HC AS NGAY_SORT
			FROM dbo.HIEU_CHUAN_MAY A
			INNER JOIN dbo.LOAI_HIEU_CHUAN B ON B.MS_LOAI_HIEU_CHUAN = A.MS_LOAI_HIEU_CHUAN
			WHERE A.MS_MAY = @deviceID AND CONVERT(DATE,A.NGAY_HC) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2)
			) AS T ORDER BY T.NGAY_SORT DESC
		END	
		ELSE

		BEGIN
			
		SELECT A.MS_PHIEU_BAO_TRI,CONVERT(NVARCHAR(10),A.NGAY_LAP,4) AS NGAY,B.MS_BO_PHAN AS MA_BP,B.MS_CV,C.MO_TA_CV AS MA_PT ,NULL AS SL_THAY_THE,
		A.NGAY_LAP AS NGAY_SORT
		INTO #PBTLS FROM dbo.PHIEU_BAO_TRI A
		INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI
		INNER JOIN dbo.CONG_VIEC C ON C.MS_CV = B.MS_CV
		WHERE A.MS_MAY = @deviceID AND CONVERT(DATE,A.NGAY_LAP) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2) AND A.TINH_TRANG_PBT > 3 
		SELECT T.LOAI,
               T.NGAY,
               T.MA_BP,
               T.MA_PT,
               T.SL_THAY_THE FROM (
		SELECT 2 AS LOAI,NGAY,MA_BP,B.MS_PT AS MA_PT,B.SL_TT SL_THAY_THE,A.NGAY_SORT FROM #PBTLS A
		INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI AND A.MS_CV = B.MS_CV AND A.MA_BP = B.MS_BO_PHAN
		WHERE (B.MS_BO_PHAN = @sCot1 OR @sCot1 ='-1') AND (B.MS_PT = @sCot2 OR @sCot2 ='-1') AND B.SL_TT > 0
		UNION
			SELECT 4 AS LOAI, CONVERT(NVARCHAR(10),A.NGAY,4) AS NGAY,A.MS_PT,REPLACE(B.TEN_LOAI_HIEU_CHUAN,'hiệu chuẩn','HC') AS MA_PT,NULL,A.NGAY AS NGAY_SORT
			FROM dbo.HIEU_CHUAN_DHD A
			INNER JOIN dbo.LOAI_HIEU_CHUAN B ON B.MS_LOAI_HIEU_CHUAN = A.MS_LOAI_HIEU_CHUAN
			WHERE A.MS_MAY = @deviceID AND CONVERT(DATE,A.NGAY) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2)) T ORDER BY T.NGAY_SORT DESC
		END	
	END
END
IF @sDanhMuc = 'HISTORY_REQUEST'
BEGIN
	IF @iLoai = 0 -- Loadcbo người yêu cầu
	BEGIN
		SELECT DISTINCT LTRIM(RTRIM(A.USER_LAP)) AS ID_NYC,A.USER_LAP +' '+ ISNULL((SELECT HO + ' ' + TEN FROM dbo.CONG_NHAN WHERE MS_CONG_NHAN = (SELECT TOP 1 MS_CONG_NHAN FROM dbo.USERS T WHERE T.USERNAME = A.USER_LAP)),'')  AS TEN_NYC FROM dbo.YEU_CAU_NSD A
		UNION
		SELECT '-1' , '< All >'
		ORDER BY ID_NYC
	END
	IF @iLoai = 1 -- LOAD LƯỚI
	BEGIN

		SELECT CONVERT(NVARCHAR(10),A.NGAY,4) AS NGAY_YC,CONVERT(NVARCHAR(10),B.THOI_GIAN_DSX,4) AS NGAY_DUYET,CONVERT(NVARCHAR(10),B.NGAY_DBT,4) AS NGAY_PBT,A.NGAY,B.MS_MAY,D.TEN_MAY,B.MO_TA_TINH_TRANG AS TINH_TRANG_MAY,CONVERT(NVARCHAR(10),C.NGAY_NGHIEM_THU,4) NGAY_KT_PBT,C.MS_PHIEU_BAO_TRI,
		CASE WHEN C.TINH_TRANG_PBT > 3 THEN 3 ELSE CASE B.THUC_HIEN_DSX WHEN 0 THEN 0 ELSE CASE when	C.MS_PHIEU_BAO_TRI IS NULL THEN 1 ELSE  2 end  end END AS TINH_TRANG
		FROM dbo.YEU_CAU_NSD A
		INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.STT = A.STT
		LEFT JOIN dbo.PHIEU_BAO_TRI C ON C.MS_PHIEU_BAO_TRI = B.MS_PBT
		INNER JOIN dbo.MAY D ON D.MS_MAY = B.MS_MAY
		WHERE CONVERT(DATE,A.NGAY) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2) AND (B.MS_MAY = @deviceID OR @deviceID = '-1') AND (LTRIM(RTRIM(A.USER_LAP)) = @sCot1 OR @sCot1 ='-1')
		ORDER BY A.NGAY DESC
	END
END

IF(@sDanhMuc = 'ACCEPT_MAINTENANCE')
BEGIN
	SELECT DISTINCT MS_MAY,TEN_MAY INTO #MAY_USER1 FROM [dbo].[MGetMayUserNgay](@DNgay,@UserName,'-1',-1,-1,'-1','-1','-1',@NNgu)

	SELECT DISTINCT A.MS_PHIEU_BAO_TRI,A.MS_MAY,I.TEN_MAY,
	CONVERT(NVARCHAR(10),B.NGAY_HOAN_THANH,4) NGAY_HOAN_THANH,E.TEN_LOAI_BT,B.MS_BO_PHAN,
	CASE @NNgu WHEN 0 THEN F.TEN_BO_PHAN WHEN 1 THEN ISNULL(NULLIF(F.TEN_BO_PHAN_ANH,''),F.TEN_BO_PHAN) ELSE ISNULL(NULLIF(F.TEN_BO_PHAN_HOA,''),F.TEN_BO_PHAN) END AS TEN_BO_PHAN,B.MS_CV,
	CASE @NNgu WHEN 0 THEN G.MO_TA_CV WHEN 1 THEN ISNULL(NULLIF(G.MO_TA_CV_ANH,''),G.MO_TA_CV) ELSE ISNULL(NULLIF(G.MO_TA_CV_HOA,''),G.MO_TA_CV) END AS MO_TA_CV,
	C.MS_PT,
	CASE @NNgu WHEN 0 THEN H.TEN_PT WHEN 1 THEN ISNULL(NULLIF(H.TEN_PT_ANH,''),H.TEN_PT) ELSE ISNULL(NULLIF(H.TEN_PT_HOA,''),H.TEN_PT) END AS TEN_PT,
	C.SL_TT
	FROM dbo.PHIEU_BAO_TRI A
	INNER  JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI
	LEFT JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG C ON C.MS_PHIEU_BAO_TRI = B.MS_PHIEU_BAO_TRI AND C.MS_CV = B.MS_CV AND C.MS_BO_PHAN = B.MS_BO_PHAN
	INNER JOIN  dbo.LOAI_BAO_TRI E ON E.MS_LOAI_BT = A.MS_LOAI_BT
	LEFT JOIN dbo.CAU_TRUC_THIET_BI F ON F.MS_MAY = A.MS_MAY AND F.MS_BO_PHAN = B.MS_BO_PHAN
	LEFT JOIN dbo.CONG_VIEC G ON G.MS_CV = B.MS_CV
	LEFT JOIN dbo.IC_PHU_TUNG H ON H.MS_PT = C.MS_PT
	INNER JOIN #MAY_USER1 I ON I.MS_MAY = A.MS_MAY
	WHERE CONVERT(DATE,B.NGAY_HOAN_THANH) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2) AND TINH_TRANG_PBT = 3
	ORDER BY MS_PHIEU_BAO_TRI DESC

END
IF(@sDanhMuc = 'COMPLETE_WORDORDER')
BEGIN
	IF NOT EXISTS(SELECT * FROM dbo.USER_CHUC_NANG WHERE STT = 7 AND USERNAME = @UserName)
	BEGIN
		SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Không có quyền hoàn thành phiếu' ELSE 'No right to complete the vote' END	 AS [NAME]
		RETURN;
	END
	--kiểm tra khai báo thời gian làm việc
	SELECT @icot1 = COUNT(*) FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1
	SELECT @icot2 = COUNT(*) FROM dbo.PHIEU_BAO_TRI_NHAN_SU WHERE MS_PHIEU_BAO_TRI = @sCot1 AND NGAY IS NOT NULL
	IF((@icot1 + @icot2) = 0)
	BEGIN
		SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Chưa khai báo thời gian làm việc' ELSE 'Working time has not been declared' END	 AS [NAME]
		RETURN;
	END
	--kiểm tra có vật tư mà không có phiếu xuất
	IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1)
	BEGIN
		IF NOT EXISTS (SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_PHIEU_BAO_TRI = @sCot1)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Chưa có phiếu xuất kho' ELSE 'No delivery slip yet' END	 AS [NAME]
			RETURN;
		END
		ELSE
        BEGIN
			IF NOT EXISTS (SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_PHIEU_BAO_TRI = @sCot1 AND LOCK = 1)
			BEGIN
				SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Chưa khóa phiếu xuất' ELSE 'Not locked out voucher' END	 AS [NAME]
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

		IF EXISTS(SELECT * FROM #BTCAN WHERE (SL_TT > SL_VT))
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phụng tùng không cân,bạn kiểm tra lại' ELSE 'Spare parts do not weigh, you check again' END	 AS [NAME]
			RETURN;
		END
	END
	-- cập nhật hoành thành phiếu bảo trì
	UPDATE PHIEU_BAO_TRI SET TT_SAU_BT=NULL,NGAY_NGHIEM_THU=NULL,NGUOI_NGHIEM_THU=NULL,TINH_TRANG_PBT = 3 WHERE MS_PHIEU_BAO_TRI= @sCot1
	UPDATE PHIEU_BAO_TRI_CONG_VIEC SET MS_MAY_TT=NULL ,MS_BO_PHAN_TT=NULL,PHU_TUNG_TT=NULL,NGAY_HOAN_THANH = GETDATE() WHERE MS_PHIEU_BAO_TRI = @sCot1
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

IF(@sDanhMuc = 'UPATE_TINHTRANG_HOANTHANH')
BEGIN
	UPDATE dbo.PHIEU_BAO_TRI SET TINH_TRANG_PBT = 2 where MS_PHIEU_BAO_TRI = @sCot1
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
END

IF(@sDanhMuc = 'ACCEPTANCE_WORDORDER')
BEGIN
--acceptance
	--kiểm tra có quyền không
	IF NOT EXISTS(SELECT * FROM dbo.USER_CHUC_NANG WHERE STT = 8 AND USERNAME = @UserName)
	BEGIN
		SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Không có quyền nghiệm thu phiếu' ELSE 'No voting right' END	 AS [NAME]
		RETURN;
	END
	--kiểm tra khai báo thời gian làm việc
	SELECT @icot1 = COUNT(*) FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1
	SELECT @icot2 = COUNT(*) FROM dbo.PHIEU_BAO_TRI_NHAN_SU WHERE MS_PHIEU_BAO_TRI = @sCot1 AND NGAY IS NOT NULL
	IF((@icot1 + @icot2) = 0)
	BEGIN
		SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Chưa khai báo thời gian làm việc' ELSE 'Working time has not been declared' END	 AS [NAME]
		RETURN;
	END
	--kiểm tra có vật tư mà không có phiếu xuất
	IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1)
	BEGIN
		IF NOT EXISTS (SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_PHIEU_BAO_TRI = @sCot1)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Chưa có phiếu xuất kho' ELSE 'No delivery slip yet' END	 AS [NAME]
			RETURN;
		END
		ELSE
        BEGIN
			IF NOT EXISTS (SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_PHIEU_BAO_TRI = @sCot1 AND LOCK = 1)
			BEGIN
				SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Chưa có phiếu xuất kho' ELSE 'Not locked out voucher' END	 AS [NAME]
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
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phụng tùng không cân,bạn kiểm tra lại' ELSE 'Spare parts do not weigh, you check again' END	 AS [NAME]
			RETURN;
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
SELECT MS_CONG_NHAN,SUM(SO_GIO) AS TONG_GIO FROM dbo.PHIEU_BAO_TRI_NHAN_SU WHERE MS_PHIEU_BAO_TRI = @sCot1 AND NGAY IS NOT NULL GROUP BY MS_CONG_NHAN) T1
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
	SELECT CONVERT(BIT,0) AS CHON,A.MS_MAY,
	CASE @NNgu WHEN 0 THEN D.TEN_MAY WHEN 1 THEN ISNULL(NULLIF(D.TEN_MAY_ANH,''),D.TEN_MAY) ELSE ISNULL(NULLIF(D.TEN_MAY_HOA,''),D.TEN_MAY) END AS TEN_MAY,
	A.NGAY_CHUYEN,A.KHO_DI,B.Ten_N_XUONG AS TEN_KHO_DI,A.KHO_DEN,C.Ten_N_XUONG AS TEN_KHO_DEN,A.NGAY_NHAN,DATEDIFF(DAY,A.NGAY_CHUYEN,GETDATE()) AS SO_NGAY 
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
	SELECT CONVERT(BIT,0) AS CHON,A.MS_MAY,
	CASE @NNgu WHEN 0 THEN C.TEN_MAY WHEN 1 THEN ISNULL(NULLIF(C.TEN_MAY_ANH,''),C.TEN_MAY) ELSE ISNULL(NULLIF(C.TEN_MAY_HOA,''),C.TEN_MAY) END AS TEN_MAY,
	A.NGAY_SCAN,A.MS_KHO,
	CASE @NNgu WHEN 0 THEN B.Ten_N_XUONG WHEN 1 THEN ISNULL(NULLIF(B.TEN_N_XUONG_A,''),B.Ten_N_XUONG) ELSE ISNULL(NULLIF(B.TEN_N_XUONG_H,''),B.Ten_N_XUONG) END AS TEN_KHO
	INTO #BT
	FROM dbo.KIEM_KE_THIET_BI A
	INNER JOIN dbo.NHA_XUONG B ON A.MS_KHO = B.MS_N_XUONG
	INNER JOIN dbo.MAY C ON C.MS_MAY = A.MS_MAY
	WHERE ISNULL(A.DA_KIEM,0) = 0

	SELECT CHON,
           MS_MAY,
           TEN_MAY,
           NGAY_SCAN,
           MS_KHO,
           TEN_KHO FROM #BT ORDER BY NGAY_SCAN DESC
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

IF(@sDanhMuc ='GET_GOODRECEIPT')
BEGIN
	
	SELECT     T1.MS_KHO INTO #KHO_USER 
FROM         dbo.NHOM_KHO AS T1 INNER JOIN
                      dbo.USERS AS T2 ON T1.GROUP_ID = T2.GROUP_ID 
WHERE     (T2.USERNAME = @USERNAME)

	SELECT TOP 100 MS_DH_NHAP_PT,
	CASE @NNgu WHEN 0 THEN DANG_NHAP_VIET WHEN 1 THEN ISNULL(NULLIF(b.DANG_NHAP_ANH,''),DANG_NHAP_VIET) ELSE ISNULL(NULLIF(b.DANG_NHAP_HOA,''),DANG_NHAP_VIET) END AS DANG_NHAP,
	a.NGAY,c.TEN,a.LOCK ,a.THU_KHO AS USER_LAP
	FROM dbo.IC_DON_HANG_NHAP a
	INNER JOIN dbo.IC_KHO d ON d.MS_KHO = a.MS_KHO
	INNER JOIN #KHO_USER E ON E.MS_KHO = d.MS_KHO
	INNER JOIN dbo.DANG_NHAP b ON b.MS_DANG_NHAP = a.MS_DANG_NHAP
	INNER JOIN (SELECT MS_KH AS MS,TEN_RUT_GON AS TEN FROM dbo.KHACH_HANG UNION SELECT MS_CONG_NHAN,HO +' '+TEN from dbo.CONG_NHAN) as c ON c.MS = a.NGUOI_NHAP
	WHERE ('-1' = @sCot1  or a.MS_KHO=@sCot1)
AND ( CONVERT(DATE,A.NGAY) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2))
	ORDER BY a.NGAY DESC, MS_DH_NHAP_PT DESC
END


IF(@sDanhMuc ='GET_GOODISSUE')
BEGIN
	
	SELECT     T1.MS_KHO INTO #KHO_USERX 
FROM         dbo.NHOM_KHO AS T1 INNER JOIN
                      dbo.USERS AS T2 ON T1.GROUP_ID = T2.GROUP_ID 
WHERE     (T2.USERNAME = @USERNAME)

	SELECT TOP 100 A.MS_DH_XUAT_PT,A.SO_PHIEU_XN,
	CASE @NNgu WHEN 0 THEN DANG_XUAT_VIET WHEN 1 THEN ISNULL(NULLIF(b.DANG_XUAT_ANH,''),DANG_XUAT_VIET) ELSE ISNULL(NULLIF(b.DANG_XUAT_HOA,''),DANG_XUAT_VIET) END AS DANG_XUAT,
	a.NGAY,c.TEN,a.LOCK ,a.THU_KHO AS USER_LAP
	FROM dbo.IC_DON_HANG_XUAT A
	INNER JOIN dbo.IC_KHO d ON d.MS_KHO = a.MS_KHO
	INNER JOIN #KHO_USERX E ON E.MS_KHO = d.MS_KHO
	INNER JOIN dbo.DANG_XUAT b ON b.MS_DANG_XUAT = a.MS_DANG_XUAT
	INNER JOIN (SELECT MS_KH AS MS,TEN_RUT_GON AS TEN FROM dbo.KHACH_HANG UNION SELECT MS_CONG_NHAN,HO +' '+TEN from dbo.CONG_NHAN) as c ON c.MS = a.NGUOI_NHAN
	WHERE ('-1' = @sCot1  or a.MS_KHO=@sCot1)
AND ( CONVERT(DATE,A.NGAY) BETWEEN CONVERT(DATE,@dCot1) AND CONVERT(DATE,@dCot2))
	ORDER BY a.NGAY DESC, A.SO_PHIEU_XN DESC
END


IF(@sDanhMuc ='GET_GOODRECEIPT_DETAILS')
BEGIN
	IF(@sCot1 <> '-1')
	BEGIN
		
	    SELECT MS_DH_NHAP_PT,MS_KHO,NGAY,MS_DANG_NHAP,
		CASE MS_DANG_NHAP WHEN 3 THEN (SELECT SO_DE_XUAT FROM dbo.DE_XUAT_MUA_HANG WHERE MS_DE_XUAT = MS_DDH)  WHEN 6 THEN (SELECT SO_PHIEU_XN FROM dbo.IC_DON_HANG_XUAT WHERE MS_DH_XUAT_PT = MS_DHX)  ELSE NULL END AS MS_DDH,
		MS_DHX,NGUOI_NHAP,SO_CHUNG_TU,NGAY_CHUNG_TU,GHI_CHU,LOCK,THU_KHO AS USER_LAP,0 AS THEM FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1
	END
	ELSE
	BEGIN
       SELECT (dbo.AUTO_CREATE_SO_PHIEU_NHAP(GETDATE())) MS_DH_NHAP_PT,@icot1 AS MS_KHO,GETDATE() NGAY,-1 AS MS_DANG_NHAP,NULL AS  MS_DDH,NULL AS  MS_DHX,NULL AS NGUOI_NHAP,NULL AS SO_CHUNG_TU,NULL AS  NGAY_CHUNG_TU,NULL AS GHI_CHU,NULL AS  LOCK,@UserName AS USER_LAP, 1 AS THEM
	END
END

IF(@sDanhMuc ='GET_GOODISSUE_DETAILS')
BEGIN
	IF(@sCot1 <> '-1')
	BEGIN
	    SELECT MS_DH_XUAT_PT,SO_PHIEU_XN,MS_KHO,NGAY,MS_DANG_XUAT,MS_PHIEU_BAO_TRI,(SELECT T.MS_MAY FROM dbo.PHIEU_BAO_TRI T WHERE T.MS_PHIEU_BAO_TRI = B.MS_PHIEU_BAO_TRI) AS MS_MAY,MS_BP_CHIU_PHI,(SELECT TOP 1 A.TEN_BP_CHIU_PHI FROM dbo.BO_PHAN_CHIU_PHI A WHERE A.MS_BP_CHIU_PHI = B.MS_BP_CHIU_PHI) AS TEN_BP_CHIU_PHI,NGUOI_NHAN,SO_CHUNG_TU,NGAY_CHUNG_TU,GHI_CHU,LOCK,THU_KHO AS USER_LAP,0 AS THEM 
		FROM dbo.IC_DON_HANG_XUAT B WHERE MS_DH_XUAT_PT = @sCot1
	END
	ELSE
	BEGIN
       SELECT (dbo.AUTO_CREATE_SO_PHIEU_XUAT(GETDATE())) AS MS_DH_XUAT_PT,NULL as SO_PHIEU_XN,@icot1 AS MS_KHO,GETDATE() NGAY,-1 AS MS_DANG_XUAT,NULL AS  MS_PHIEU_BAO_TRI,NULL AS  MS_BP_CHIU_PHI,NULL AS  TEN_BP_CHIU_PHI,NULL AS NGUOI_NHAN,NULL AS SO_CHUNG_TU,NULL AS  NGAY_CHUNG_TU,NULL AS GHI_CHU,NULL AS  LOCK,@UserName AS USER_LAP, 1 AS THEM
	END
END

IF(@sDanhMuc ='PARTS_LIST')
BEGIN
--spCMMSWEB

	IF EXISTS((SELECT * FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1 AND LOCK = 0 AND LOWER(THU_KHO) = LOWER(@UserName)))
	BEGIN
		SET @bcot1 = 1;
	END
	ELSE
	BEGIN
		SET @bcot1 = 0;
	END

	SELECT MS_PT,A.SL_THUC_NHAP AS SO_LUONG,A.DON_GIA_GOC AS DON_GIA,
	--CASE (A.THANH_TIEN - (A.DON_GIA * A.SL_THUC_NHAP)) WHEN 0 THEN 0 else  (A.DON_GIA * A.SL_THUC_NHAP)/(A.THANH_TIEN - (A.DON_GIA * A.SL_THUC_NHAP)) end AS VAT ,
	A.TAX AS VAT,
	NGOAI_TE,(SELECT STUFF((SELECT ', ' + T2.TEN_VI_TRI +''
				  
				  FROM dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET T1
				  INNER JOIN dbo.VI_TRI_KHO T2 ON T2.MS_VI_TRI = T1.MS_VI_TRI
				  WHERE T1.MS_DH_NHAP_PT = @sCot1 AND T1.MS_PT = A.MS_PT
				  FOR XML PATH('')), 1, 2, '') AS MS_MAY) AS VI_TRI,@bcot1 AS XOA FROM dbo.IC_DON_HANG_NHAP_VAT_TU A
	WHERE MS_DH_NHAP_PT = @sCot1
END


IF(@sDanhMuc ='DANH_SACH_PHU_TUNG_XUAT')
BEGIN
--spCMMSWEB
	SELECT  @icot1 = MS_DANG_XUAT, @icot2 = MS_KHO, @sCot2 = MS_PHIEU_BAO_TRI FROM dbo.IC_DON_HANG_XUAT WHERE MS_DH_XUAT_PT = @sCot1
	IF EXISTS((SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_DH_XUAT_PT = @sCot1 AND LOCK = 0 AND LOWER(THU_KHO) = LOWER(@UserName)))
	BEGIN
		SET @bcot1 = 1;
	END
	ELSE
	BEGIN
		SET @bcot1 = 0;
	END
	SELECT A.MS_PT,C.TEN_PT,B.MS_DH_NHAP_PT,B.SL_VT AS SO_LUONG,((SELECT T.SL_VT FROM dbo.VI_TRI_KHO_VAT_TU T WHERE T.ID = B.ID_XUAT AND T.MS_DH_NHAP_PT = B.MS_DH_NHAP_PT AND T.MS_KHO = @icot2 AND T.MS_VI_TRI = B.MS_VI_TRI ) + B.SL_VT) AS SL_TON,B.MS_VI_TRI,D.TEN_VI_TRI AS VI_TRI,@bcot1 AS XOA FROM dbo.IC_DON_HANG_XUAT_VAT_TU A
	INNER JOIN dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET B ON B.MS_DH_XUAT_PT = A.MS_DH_XUAT_PT AND B.MS_PT = A.MS_PT
	INNER JOIN dbo.IC_PHU_TUNG C ON C.MS_PT = A.MS_PT
	INNER JOIN dbo.VI_TRI_KHO D ON D.MS_VI_TRI = B.MS_VI_TRI
	WHERE A.MS_DH_XUAT_PT = @sCot1
END

if(@sDanhMuc ='CHON_PHU_TUNG_XUAT')
BEGIN
		SELECT  @icot1 = MS_DANG_XUAT, @icot2 = MS_KHO, @sCot2 = MS_PHIEU_BAO_TRI FROM dbo.IC_DON_HANG_XUAT WHERE MS_DH_XUAT_PT = @sCot1


		IF(@bcot1 = 0)
			BEGIN
				SELECT DISTINCT A.MS_PT,C.TEN_PT,A.MS_DH_NHAP_PT,0 AS SL_XUAT,SUM(A.SL_VT) AS SL_TON,A.MS_VI_TRI,D.TEN_VI_TRI AS  VI_TRI FROM dbo.VI_TRI_KHO_VAT_TU A
				INNER JOIN dbo.IC_DON_HANG_NHAP B ON B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT
				INNER JOIN dbo.IC_PHU_TUNG C ON C.MS_PT = A.MS_PT
				INNER JOIN dbo.VI_TRI_KHO D ON D.MS_VI_TRI = A.MS_VI_TRI
				WHERE A.SL_VT > 0 AND B.LOCK = 1 AND A.MS_KHO = @icot2 AND NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET T1 WHERE T1.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT
				AND T1.MS_PT = A.MS_PT AND T1.MS_DH_XUAT_PT = @sCot1)
				GROUP BY A.MS_PT,C.TEN_PT,A.MS_DH_NHAP_PT,A.MS_VI_TRI,D.TEN_VI_TRI
				ORDER BY A.MS_PT
			END
			ELSE
			BEGIN
				SELECT DISTINCT A.MS_PT,CASE ISNULL(A.SL_TT,0) WHEN 0 THEN A.SL_KH ELSE A.SL_TT END AS SL_XUAT INTO #PTPBT  FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG A
				LEFT JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO b ON b.MS_PT = A.MS_PT
				WHERE A.MS_PHIEU_BAO_TRI = @sCot2

				SELECT DISTINCT A.MS_PT,D.TEN_PT,A.MS_DH_NHAP_PT,C.SL_XUAT,SUM(A.SL_VT) AS SL_TON,E.MS_VI_TRI,E.TEN_VI_TRI AS VI_TRI FROM dbo.VI_TRI_KHO_VAT_TU A
				INNER JOIN dbo.IC_DON_HANG_NHAP B ON B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT
				INNER JOIN #PTPBT C ON C.MS_PT = A.MS_PT
				INNER JOIN dbo.IC_PHU_TUNG D ON D.MS_PT = A.MS_PT
				INNER JOIN dbo.VI_TRI_KHO E ON E.MS_VI_TRI = A.MS_VI_TRI
				WHERE A.SL_VT > 0 AND B.LOCK = 1 AND A.MS_KHO = @icot2 AND NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET T1 WHERE T1.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT
				AND T1.MS_PT = A.MS_PT AND T1.MS_DH_XUAT_PT = @sCot1)
				GROUP BY A.MS_PT,D.TEN_PT,A.MS_DH_NHAP_PT,c.SL_XUAT,E.MS_VI_TRI,E.TEN_VI_TRI
				ORDER BY A.MS_PT

			END
END

IF(@sDanhMuc ='CHOOSE_PARTS_LIST')
BEGIN
--spCMMSWEB

	SELECT  @icot1 = MS_DANG_NHAP, @icot2 = MS_KHO, @sCot2 =(CASE MS_DANG_NHAP WHEN 6 THEN MS_DHX WHEN 3 THEN MS_DDH END) FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1
	IF(@icot1 = 6)
	BEGIN
	--lấy phụ tùng từ phiếu xuất

		--SELECT B.MS_PT,B.SO_LUONG_THUC_XUAT AS SO_LUONG,D.DON_GIA,CASE (D.THANH_TIEN - (D.DON_GIA * D.SL_THUC_NHAP)) WHEN 0 THEN 0 else  (D.DON_GIA * D.SL_THUC_NHAP)/(D.THANH_TIEN - (D.DON_GIA * D.SL_THUC_NHAP)) end AS VAT,
		--D.NGOAI_TE,'' AS VI_TRI, 1 AS XOA,C.MS_VI_TRI,E.TEN_VI_TRI,C.SL_VT
		--FROM dbo.IC_DON_HANG_XUAT A
		--INNER JOIN dbo.IC_DON_HANG_XUAT_VAT_TU B ON B.MS_DH_XUAT_PT = A.MS_DH_XUAT_PT
		--INNER JOIN dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET C ON C.MS_DH_XUAT_PT = B.MS_DH_XUAT_PT AND C.MS_PT = B.MS_PT
		--INNER JOIN dbo.IC_DON_HANG_NHAP_VAT_TU D ON C.MS_DH_NHAP_PT = D.MS_DH_NHAP_PT AND C.MS_PT = D.MS_PT
		--INNER JOIN dbo.VI_TRI_KHO E ON E.MS_VI_TRI = C.MS_VI_TRI
		--WHERE C.MS_DH_XUAT_PT = @sCot2 AND
		--NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP T1 INNER JOIN dbo.IC_DON_HANG_NHAP_VAT_TU T2 ON T1.MS_DH_NHAP_PT = T2.MS_DH_NHAP_PT WHERE MS_DHX = @sCot2
		--AND T2.MS_PT = B.MS_PT
		SELECT A.MS_PT,B.TEN_PT
		from dbo.IC_DON_HANG_XUAT_VAT_TU A
		INNER JOIN dbo.IC_PHU_TUNG B ON B.MS_PT = A.MS_PT
		WHERE A.MS_DH_XUAT_PT = @sCot2 AND B.ACTIVE_PT = 1 and  NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_VAT_TU T1 WHERE T1.MS_DH_NHAP_PT = @sCot1 AND T1.MS_PT = A.MS_PT) 
	END
	ELSE
    IF(@icot1 = 3)
	BEGIN
	   --lấy vật tư từ đê xuất
		
		--SELECT A.MS_PT,A.SL_DE_XUAT AS SO_LUONG,C.DON_GIA,CASE (C.THANH_TIEN -(C.DON_GIA * C.SL_THUC_NHAP)) WHEN 0 THEN 0 else  (C.DON_GIA * C.SL_THUC_NHAP)/(C.THANH_TIEN - (C.DON_GIA * C.SL_THUC_NHAP)) end AS VAT,
		--C.NGOAI_TE,'' AS VI_TRI, 1 AS XOA,dbo.fnGet_VI_TRI_PT_THEO_KHO(A.MS_PT,D.THEO_KHO, @icot2) MS_VI_TRI,(SELECT TEN_VI_TRI FROM dbo.VI_TRI_KHO WHERE MS_VI_TRI =(dbo.fnGet_VI_TRI_PT_THEO_KHO(A.MS_PT,D.THEO_KHO, @icot2))) TEN_VI_TRI,A.SL_DE_XUAT AS SL_VT
		--FROM dbo.DE_XUAT_MUA_HANG_CHI_TIET A
		--LEFT JOIN dbo.IC_DON_HANG_NHAP B ON A.MS_DE_XUAT = B.MS_DDH
		--LEFT JOIN dbo.IC_DON_HANG_NHAP_VAT_TU C ON C.MS_DH_NHAP_PT = B.MS_DH_XUAT_PT
		--INNER JOIN dbo.IC_PHU_TUNG D ON D.MS_PT = A.MS_PT
		--WHERE A.MS_DE_XUAT = @sCot2 AND
		--NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP T1 INNER JOIN dbo.IC_DON_HANG_NHAP_VAT_TU T2 ON T1.MS_DH_NHAP_PT = T2.MS_DH_NHAP_PT WHERE T1.MS_DDH = @sCot2
		--AND T2.MS_PT = A.MS_PT)
		SELECT A.MS_PT,A.TEN_PT FROM   dbo.DE_XUAT_MUA_HANG_CHI_TIET A
		INNER JOIN dbo.IC_PHU_TUNG  B ON B.MS_PT = A.MS_PT
		WHERE A.MS_DE_XUAT = @sCot2 AND B.ACTIVE_PT = 1
		and NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP T1 INNER JOIN dbo.IC_DON_HANG_NHAP_VAT_TU T2 ON T1.MS_DH_NHAP_PT = T2.MS_DH_NHAP_PT WHERE T1.MS_DDH = @sCot2
		AND T2.MS_PT = A.MS_PT)
	END
	ELSE
    BEGIN
		--lấy vật tư phụ tùng mới nhất
		--SELECT A.MS_PT,0 AS SO_LUONG,DON_GIA ,0 AS VAT,
		--NGOAI_TE,'' AS VI_TRI, 1 AS XOA,dbo.fnGet_VI_TRI_PT_THEO_KHO(A.MS_PT,THEO_KHO, @icot2) MS_VI_TRI,
		--(SELECT TEN_VI_TRI FROM dbo.VI_TRI_KHO WHERE MS_VI_TRI =(dbo.fnGet_VI_TRI_PT_THEO_KHO(A.MS_PT,A.THEO_KHO, @icot2))) TEN_VI_TRI,0 AS SL_VT 
		--FROM dbo.IC_PHU_TUNG A
		--LEFT JOIN (SELECT B.MS_PT,B.DON_GIA,B.NGOAI_TE,MAX(B.MS_DH_NHAP_PT) AS MS FROM dbo.IC_DON_HANG_NHAP_VAT_TU B GROUP BY  B.MS_PT,B.DON_GIA,B.NGOAI_TE) AS B ON B.MS_PT = A.MS_PT
		--where NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_VAT_TU T1 WHERE T1.MS_DH_NHAP_PT = @sCot1 AND T1.MS_PT = A.MS_PT)
		SELECT A.MS_PT,A.TEN_PT
		FROM dbo.IC_PHU_TUNG A
		INNER JOIN dbo.IC_PHU_TUNG_KHO B ON B.MS_PT = A.MS_PT
		WHERE B.MS_KHO = @icot2 and NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_VAT_TU T1 WHERE T1.MS_DH_NHAP_PT = @sCot1 AND T1.MS_PT = A.MS_PT) AND A.ACTIVE_PT = 1
	END
END


IF(@sDanhMuc ='GET_PHIEU_NHAP_KHO_PHU_TUNG_MORE')
BEGIN
	SELECT MS_DH_NHAP_PT,MS_PT,XUAT_XU,BAO_HANH_DEN_NGAY,TY_GIA FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2
END

IF(@sDanhMuc ='GET_BAO_CAO_NHAP_XUAT_TON')
BEGIN
	DECLARE @TonKho AS TypeInventory; 
    INSERT INTO @TonKho  exec MTinhTonKhoTheoViTri @dCot1, @dCot2,'-1',@sCot1,@icot1,@UserName,0

	SELECT TOP 1 A.MS_PT,A.TEN_PT,C.TEN_1 AS TEN_DVT,A.TON_DAU_KY,A.TON_CUOI_KY,A.SL_NHAP_TNDN AS NHAP_TRONG_KY,A.SL_XUAT_TNDN AS XUAT_TRONG_KY FROM @TonKho A
	RIGHT JOIN dbo.IC_PHU_TUNG B  ON B.MS_PT = A.MS_PT
	INNER JOIN dbo.DON_VI_TINH C ON C.DVT = B.DVT
	WHERE B.MS_PT = @sCot1

	

END


IF(@sDanhMuc ='GET_PHIEU_NHAP_KHO_PHU_TUNG_VI_TRI')
BEGIN
	--kiểm tra có quyền hay chưa
IF EXISTS((SELECT * FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1 AND LOCK = 0 AND LOWER(THU_KHO) = LOWER(@UserName)))
	BEGIN
		SET @bcot1 = 1;
	END
	ELSE
	BEGIN
		SET @bcot1 = 0;
	END
	IF(@bcot1 = 1)
	BEGIN
		SELECT MS_DH_NHAP_PT,MS_PT,A.MS_VI_TRI,B.TEN_VI_TRI,SL_VT FROM dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET A
		INNER JOIN dbo.VI_TRI_KHO B ON B.MS_VI_TRI = A.MS_VI_TRI
		WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2
		UNION
		SELECT @sCot1,@sCot2,A.MS_VI_TRI,A.TEN_VI_TRI,0 as SL_VT FROM dbo.VI_TRI_KHO A WHERE A.MS_KHO = (SELECT MS_KHO FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1)
		AND NOT EXISTS (SELECT * FROM IC_DON_HANG_NHAP_VAT_TU_CHI_TIET B WHERE B.MS_DH_NHAP_PT = @sCot1 AND B.MS_PT = @sCot2 AND B.MS_VI_TRI = A.MS_VI_TRI)
	END
	ELSE
    BEGIN
	 	SELECT MS_DH_NHAP_PT,MS_PT,A.MS_VI_TRI,B.TEN_VI_TRI,SL_VT FROM dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET A
		INNER JOIN dbo.VI_TRI_KHO B ON B.MS_VI_TRI = A.MS_VI_TRI
		WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2
		--AND A.SL_VT > CASE @bcot1 WHEN 1 THEN -1 ELSE 0 END	
	END
END



IF(@sDanhMuc = 'BACK_LOG')
BEGIN
	BEGIN TRANSACTION BLog
	BEGIN TRY
		
		DECLARE @HANG_MUC_ID INT 
		
		SET @deviceID = (SELECT MS_MAY FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1)

		--scot1 : MS_PHIEU_BAO_TRI
		--scot2:MS_BO_PHAN
		--icot1: MS_CV
		--kiểm tra có hạng mục ID chưa lấy hạng mục ID theo Phiếu bảo trì
		IF EXISTS(SELECT * FROM dbo.KE_HOACH_TONG_CONG_VIEC WHERE MS_PHIEU_BAO_TRI = @sCot1)
		BEGIN
		 SET @HANG_MUC_ID = (SELECT TOP 1 HANG_MUC_ID FROM dbo.KE_HOACH_TONG_CONG_VIEC WHERE MS_PHIEU_BAO_TRI = @sCot1)
		END
		ELSE
		BEGIN
			INSERT INTO dbo.KE_HOACH_TONG_THE
			(
			   MS_MAY,
               TEN_HANG_MUC,
               NGAY,
               NGAY_DK_HT,
               MS_LOAI_BT,
               NGAY_BTPN,
               LY_DO_SC,
               USERNAME,
               NGAY_GOC,
               NGAY_DK_HT_GOC
			)
			SELECT MS_MAY,(SELECT TEN_LOAI_BT FROM dbo.LOAI_BAO_TRI WHERE MS_LOAI_BT =A.MS_LOAI_BT),GETDATE(),GETDATE(),A.MS_LOAI_BT,GETDATE(),2,@UserName,GETDATE(),GETDATE() FROM dbo.PHIEU_BAO_TRI A
			WHERE MS_PHIEU_BAO_TRI = @sCot1 
			 SET @HANG_MUC_ID =  SCOPE_IDENTITY()
		END

		--kiểm tra có kế hoạch tổng công việc theo hạng mục chưa

		IF EXISTS(SELECT * FROM KE_HOACH_TONG_CONG_VIEC WHERE MS_MAY =@deviceID AND	 HANG_MUC_ID = @HANG_MUC_ID AND MS_CV = @icot1 
	AND MS_BO_PHAN = @sCot2 AND MS_PHIEU_BAO_TRI = @sCot1)
BEGIN
			UPDATE KE_HOACH_TONG_CONG_VIEC SET MS_PHIEU_BAO_TRI = NULL, SNGUOI = B.SO_NGUOI, YCAU_NS = B.YEU_CAU_NS, 
		YCAU_DC = B.YEU_CAU_DUNG_CU, THOI_GIAN_DU_KIEN = B.SO_GIO_KH
	FROM KE_HOACH_TONG_CONG_VIEC A INNER JOIN PHIEU_BAO_TRI_CONG_VIEC B ON A.MS_PHIEU_BAO_TRI = B.MS_PHIEU_BAO_TRI
			AND A.MS_BO_PHAN = B.MS_BO_PHAN AND A.MS_CV = B.MS_CV AND A.HANG_MUC_ID = B.HANG_MUC_ID
		WHERE MS_MAY = @deviceID AND A.HANG_MUC_ID = @HANG_MUC_ID AND A.MS_CV = @icot1 
			AND A.MS_BO_PHAN = @sCot2 AND A.MS_PHIEU_BAO_TRI = @sCot1
		END
		ELSE
        BEGIN
			INSERT INTO KE_HOACH_TONG_CONG_VIEC (MS_MAY, HANG_MUC_ID, MS_CV,MS_BO_PHAN,SNGUOI,YCAU_NS,YCAU_DC,THOI_GIAN_DU_KIEN)
			SELECT     dbo.PHIEU_BAO_TRI.MS_MAY, dbo.KE_HOACH_TONG_THE.HANG_MUC_ID, dbo.PHIEU_BAO_TRI_CONG_VIEC.MS_CV, dbo.PHIEU_BAO_TRI_CONG_VIEC.MS_BO_PHAN, 
						dbo.PHIEU_BAO_TRI_CONG_VIEC.SO_NGUOI,dbo.PHIEU_BAO_TRI_CONG_VIEC.YEU_CAU_NS,
						dbo.PHIEU_BAO_TRI_CONG_VIEC.YEU_CAU_DUNG_CU,dbo.PHIEU_BAO_TRI_CONG_VIEC.SO_GIO_KH
			FROM         dbo.PHIEU_BAO_TRI INNER JOIN
								  dbo.PHIEU_BAO_TRI_CONG_VIEC ON dbo.PHIEU_BAO_TRI.MS_PHIEU_BAO_TRI = dbo.PHIEU_BAO_TRI_CONG_VIEC.MS_PHIEU_BAO_TRI INNER JOIN
								  dbo.KE_HOACH_TONG_THE ON dbo.PHIEU_BAO_TRI.MS_MAY = dbo.KE_HOACH_TONG_THE.MS_MAY
			WHERE  dbo.PHIEU_BAO_TRI.MS_PHIEU_BAO_TRI = @sCot1 AND dbo.KE_HOACH_TONG_THE.HANG_MUC_ID = @HANG_MUC_ID 
			AND  dbo.PHIEU_BAO_TRI_CONG_VIEC.MS_CV = @icot1 AND   dbo.PHIEU_BAO_TRI_CONG_VIEC.MS_BO_PHAN = @sCot2

		
			INSERT INTO KE_HOACH_TONG_CONG_VIEC_PHU_TUNG (MS_MAY, HANG_MUC_ID, MS_CV,MS_BO_PHAN , MS_PT, SO_LUONG )
			SELECT     dbo.PHIEU_BAO_TRI.MS_MAY, dbo.KE_HOACH_TONG_THE.HANG_MUC_ID, dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_CV, 
								  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_BO_PHAN, dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PT, 
								  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.SL_KH
			FROM         dbo.PHIEU_BAO_TRI INNER JOIN
								  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG ON 
								  dbo.PHIEU_BAO_TRI.MS_PHIEU_BAO_TRI = dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PHIEU_BAO_TRI INNER JOIN
								  dbo.KE_HOACH_TONG_THE ON dbo.PHIEU_BAO_TRI.MS_MAY = dbo.KE_HOACH_TONG_THE.MS_MAY
			WHERE  dbo.PHIEU_BAO_TRI.MS_PHIEU_BAO_TRI = @sCot1 AND dbo.KE_HOACH_TONG_THE.HANG_MUC_ID = @HANG_MUC_ID 
			AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_CV = @iCot1 AND   dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_BO_PHAN = @sCot2 
		END


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO 
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET 
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU .MS_BO_PHAN = @sCot2



		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC .MS_BO_PHAN = @sCot2


		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION BLog
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION BLog;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
	
END



IF(@sDanhMuc = 'DELETE_WORK')
BEGIN
	BEGIN TRANSACTION DWork
	BEGIN TRY
		
		--kiểm tra user có phải user tạo cho phiếu bảo trì không
		--Chưa khai báo thời gian làm việc
		--[spCMMSWEB]

		if(LOWER(@UserName) != (SELECT LOWER(USERNAME_NGUOI_LAP) FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1))
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Bạn không phải là người lập nên không có quyền xóa!' ELSE 'You are not the creator, so you do not have the right to delete!' END	 AS [NAME]
			ROLLBACK TRANSACTION DWork;   
			RETURN;
		END
		
		--Chưa khai báo thời gian làm việc
		SET @icot2 = (select COUNT(*) FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1 AND MS_CV = @icot1)
		IF((@icot2) > 0)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phiếu bảo trì này đã khai báo thời gian làm việc không được xóa' ELSE 'This maintenance ticket declared working time is not deleted!' END	 AS [NAME]
			ROLLBACK TRANSACTION DWork;   
			RETURN;
		END

		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO 
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET 
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU .MS_BO_PHAN = @sCot2



		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH .MS_BO_PHAN = @sCot2


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC.MS_PHIEU_BAO_TRI  = @sCot1  AND  dbo.PHIEU_BAO_TRI_CONG_VIEC .MS_CV = @iCot1 
		AND  dbo.PHIEU_BAO_TRI_CONG_VIEC .MS_BO_PHAN = @sCot2

		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION DWork
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION DWork;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
	
END

IF(@sDanhMuc = 'DELETE_WORK_ORDER')
BEGIN
	BEGIN TRANSACTION DWorkOrder
	BEGIN TRY
		
		--kiểm tra user có phải user tạo cho phiếu bảo trì không

		if(LOWER(@UserName) != (SELECT LOWER(USERNAME_NGUOI_LAP) FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1))
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Bạn không phải là người lập nên không có quyền xóa!' ELSE 'You are not the creator so do not have the right to delete!' END	 AS [NAME]
			ROLLBACK TRANSACTION DWorkOrder;   
			RETURN;
		END
		
		--Chưa khai báo thời gian làm việc
	IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU A
		INNER JOIN dbo.PHIEU_BAO_TRI_NHAN_SU B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI
		WHERE A.MS_PHIEU_BAO_TRI = @sCot1 AND B.NGAY IS NOT NULL)
	BEGIN
		SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phiếu bảo trì này đã khai báo thời gian làm việc không được xóa!' ELSE 'This maintenance ticket declared working time is not deleted!' END	 AS [NAME]

		ROLLBACK TRANSACTION DWorkOrder;   
		RETURN;
	END
	--- kiểm tra phiếu bảo trì tồn tại bên yêu cầu
	   IF EXISTS(SELECT * FROM dbo.YEU_CAU_NSD_CHI_TIET WHERE MS_PBT = @sCot1)
	   BEGIN
		SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phiếu bảo trì này được chuyển từ bên yêu cầu,Bạn không thể xóa!' ELSE 'This maintenance ticket was transferred from the requesting party,You cannot delete it!' END	 AS [NAME]
		ROLLBACK TRANSACTION DWorkOrder;   
		RETURN;
	   END
		
		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO 
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO.MS_PHIEU_BAO_TRI  = @sCot1 


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET 
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET.MS_PHIEU_BAO_TRI  = @sCot1 


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PHIEU_BAO_TRI  = @sCot1

		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU_CHI_TIET.MS_PHIEU_BAO_TRI  = @sCot1


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_NHAN_SU.MS_PHIEU_BAO_TRI  = @sCot1 


		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC_KE_HOACH.MS_PHIEU_BAO_TRI  = @sCot1 

		DELETE dbo.PHIEU_BAO_TRI_CONG_VIEC
		WHERE  dbo.PHIEU_BAO_TRI_CONG_VIEC.MS_PHIEU_BAO_TRI  = @sCot1  

		DELETE PHIEU_BAO_TRI_TINH_TRANG_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1

		DELETE PHIEU_BAO_TRI_TINH_TRANG_CHI_TIET WHERE MS_PHIEU_BAO_TRI = @sCot1

		DELETE dbo.PHIEU_BAO_TRI_CLASS WHERE MS_PHIEU_BAO_TRI = @sCot1

		DELETE dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1

		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION DWorkOrder
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION DWorkOrder;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
	
END

IF(@sDanhMuc = 'DELETE_PHIEU_NHAP_KHO')
BEGIN
	BEGIN TRANSACTION DPhieuNhap
	BEGIN TRY
		--kiểm tra user có phải user tạo cho phiếu bảo trì không

		if(LOWER(@UserName) <> (SELECT TOP 1 LOWER(THU_KHO) FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1))
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Bạn không phải là người lập nên không có quyền xóa!' ELSE 'You are not the creator so do not have the right to delete!' END	 AS [NAME]
			ROLLBACK TRANSACTION DPhieuNhap;   
			RETURN;
		END
		--kiểm tra tồn tại trong phiếu xuất
		IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO WHERE MS_DH_NHAP_PT = @sCot1)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phiếu nhập đã tồn tại trong phiếu bảo trì, bạn không thể xóa!' ELSE 'The entry ticket already exists in the maintenance ticket, you cannot delete it!' END	 AS [NAME]
			ROLLBACK TRANSACTION DPhieuNhap;   
			RETURN;
		END

			IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET WHERE MS_DH_NHAP_PT = @sCot1)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phiếu nhập đã tồn tại trong phiếu xuất, bạn không thể xóa!' ELSE 'The entry ticket already exists in the output ticket, you cannot delete it!' END	 AS [NAME]
			ROLLBACK TRANSACTION DPhieuNhap;   
			RETURN;
		END
		DELETE dbo.VI_TRI_KHO_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1
		DELETE dbo.IC_DON_HANG_NHAP_X_VAT_TU_CHI_TIET WHERE MS_DH_NHAP_PT = @sCot1
		DELETE dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1
		DELETE dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT = @sCot1
		DELETE dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1
		--Chưa khai báo thời gian làm việc
		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION DPhieuNhap
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION DPhieuNhap;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
	
END

IF(@sDanhMuc = 'DELETE_PHIEU_XUAT_KHO')
BEGIN
	BEGIN TRANSACTION DPhieuXuat
	BEGIN TRY
		--kiểm tra user có phải user tạo cho phiếu bảo trì không

		if(LOWER(@UserName) <> (SELECT TOP 1 LOWER(THU_KHO) FROM dbo.IC_DON_HANG_XUAT WHERE MS_DH_XUAT_PT = @sCot1))
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Bạn không phải là người lập nên không có quyền xóa!' ELSE 'You are not the creator so do not have the right to delete!' END	 AS [NAME]
			ROLLBACK TRANSACTION DPhieuXuat;   
			RETURN;
		END
		--kiểm tra tồn tại trong phiếu bảo trì
		IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO WHERE MS_DH_XUAT_PT = @sCot1)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phiếu xuất đã tồn tại trong phiếu bảo trì, bạn không thể xóa!' ELSE 'The export ticket already exists in the maintenance ticket, you cannot delete it!' END	 AS [NAME]
		    ROLLBACK TRANSACTION DPhieuXuat;   
			RETURN;
		END

			IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_XUAT_PT = @sCot1)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phiếu xuất đã tồn tại trong phiếu nhập, bạn không thể xóa!' ELSE 'Output slip already exists in input slip, you can''t delete it!' END	 AS [NAME]
			ROLLBACK TRANSACTION DPhieuXuat;   
			RETURN;
		END

		UPDATE A
		SET A.SL_VT = A.SL_VT + B.SL_VT
		FROM dbo.VI_TRI_KHO_VAT_TU A
		INNER JOIN dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET B ON B.MS_VI_TRI = A.MS_VI_TRI AND B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT AND B.MS_VI_TRI = A.MS_VI_TRI AND B.MS_PT = A.MS_PT AND A.ID = B.ID_XUAT
		WHERE B.MS_DH_XUAT_PT = @sCot1

		DELETE dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET WHERE MS_DH_XUAT_PT = @sCot1
		DELETE dbo.IC_DON_HANG_XUAT_VAT_TU WHERE MS_DH_XUAT_PT = @sCot1
		DELETE dbo.IC_DON_HANG_XUAT WHERE MS_DH_XUAT_PT = @sCot1

		--Chưa khai báo thời gian làm việc
		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION DPhieuXuat
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION DPhieuXuat;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
	
END


IF(@sDanhMuc = 'DELETE_PHU_TUNG_XUAT_KHO')
BEGIN
	BEGIN TRANSACTION DPTPhieuXuat
	BEGIN TRY
		UPDATE A
		SET A.SL_VT = A.SL_VT + B.SL_VT
		FROM dbo.VI_TRI_KHO_VAT_TU A
		INNER JOIN dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET B ON B.MS_VI_TRI = A.MS_VI_TRI AND B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT AND B.MS_VI_TRI = A.MS_VI_TRI AND B.MS_PT = A.MS_PT AND A.ID = B.ID_XUAT
		WHERE B.MS_DH_XUAT_PT = @sCot1 AND B.MS_PT = @sCot2 AND B.MS_DH_NHAP_PT = @sCot3

		DELETE IC_DON_HANG_XUAT_VAT_TU_CHI_TIET  WHERE MS_DH_XUAT_PT = @sCot1 AND MS_PT = @sCot2 AND MS_DH_NHAP_PT = @sCot3
		--nếu còn phụ tùng trong vật tư khì không delete
		DELETE  A 
		FROM IC_DON_HANG_XUAT_VAT_TU  A 
		WHERE A.MS_DH_XUAT_PT = @sCot1 AND MS_PT = @sCot2 AND NOT EXISTS(SELECT * FROM IC_DON_HANG_XUAT_VAT_TU_CHI_TIET B WHERE B.MS_DH_XUAT_PT = A.MS_DH_XUAT_PT AND B.MS_PT =  A.MS_PT)
		--Chưa khai báo thời gian làm việc
		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION DPTPhieuXuat
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION DPTPhieuXuat;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
	
END

IF(@sDanhMuc = 'DELETE_PHU_TUNG_NHAP_KHO')
BEGIN
	BEGIN TRANSACTION DPTPhieuNhap
	BEGIN TRY

		--kiểm tra phiếu nhập này có trong phiếu xuất chưa
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phụ tùng của phiếu nhập này đã được xuất,Bạn không thể xóa!' ELSE 'The widget for this entry has been exported, you cannot delete it!' END	 AS [NAME]
			ROLLBACK TRANSACTION DPTPhieuNhap;   
			RETURN;
		END
		DELETE dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2
		DELETE dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2
		DELETE VI_TRI_KHO_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2
		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]


			--kiểm tra có chi phí không
	IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT = @sCot1 AND TONG_CP > 0)
	BEGIN
		--cập nhật tổng chi phí nhập khẩu theo số lượng
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 1)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 1)
			
			SET @icot2 = (SELECT SUM(SL_THUC_NHAP) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_NHAP_KHAU_VT = ((@fcot1/ @icot2) * SL_THUC_NHAP)
			WHERE MS_DH_NHAP_PT = @sCot1

		END
		---cập nhật tổng chi phí khác theo số lượng
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 10)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 10 )
			
			SET @icot2 = (SELECT SUM(SL_THUC_NHAP) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_KHAC_VT =  ((@fcot1/ @icot2) * SL_THUC_NHAP)
			WHERE MS_DH_NHAP_PT = @sCot1
		END
		--cập nhật tổng chi phí nhập khẩu theo giá trị
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 1)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 1)
			
			SET @fcot2 = (SELECT SUM(DON_GIA_GOC * SL_THUC_NHAP * TY_GIA) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_NHAP_KHAU_VT = ((@fcot1/ @fcot2) * (DON_GIA_GOC * SL_THUC_NHAP * TY_GIA ))
			WHERE MS_DH_NHAP_PT = @sCot1
		END
		---cập nhật tổng chi phí khác giá trị
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 10)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 10)
			
			SET @fcot2 = (SELECT SUM(DON_GIA_GOC * SL_THUC_NHAP * TY_GIA) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_KHAC_VT =  ((@fcot1/ @fcot2) * (DON_GIA_GOC * SL_THUC_NHAP * TY_GIA))
			WHERE MS_DH_NHAP_PT = @sCot1
		END

		UPDATE dbo.IC_DON_HANG_NHAP_VAT_TU 
		SET DON_GIA = (DON_GIA_GOC * TY_GIA) + (TONG_CP_KHAC_VT/SL_THUC_NHAP) + (TONG_CP_NHAP_KHAU_VT /SL_THUC_NHAP),
		THANH_TIEN = (DON_GIA * SL_THUC_NHAP) + TT_TAX
		WHERE MS_DH_NHAP_PT = @sCot1
	END


	COMMIT TRANSACTION DPTPhieuNhap
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION DPTPhieuNhap;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
END
IF(@sDanhMuc = 'SCAN_PHU_TUNG_XUAT')
BEGIN
	BEGIN TRANSACTION ScanPTX
	BEGIN TRY
		SELECT @icot1 = MS_KHO FROM dbo.IC_DON_HANG_XUAT WHERE MS_DH_XUAT_PT = @sCot1
		--kiểm tra xem phụ tùng này có còn trong kho không
		IF((SELECT SUM(SL_VT) FROM dbo.VI_TRI_KHO_VAT_TU WHERE MS_KHO = @icot1 AND MS_PT = @sCot2 AND MS_DH_NHAP_PT = @sCot3) = 0)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phụ tùng này đã hết trong kho!' ELSE 'This part is out of stock!' END	 AS [NAME]
			ROLLBACK TRANSACTION ScanPTX;   
			RETURN;
		END
		--kiểm tra phụ tùng này đã tồn tại trong phiếu xuất chưa
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET WHERE MS_DH_XUAT_PT = @sCot1 AND MS_PT = @sCot2 AND MS_DH_NHAP_PT = @sCot3)
		BEGIN
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Phụ tùng này đã được xuấ trong phiếu này!' ELSE 'This widget has been published in this coupon!' END	 AS [NAME]
			ROLLBACK TRANSACTION ScanPTX;   
			RETURN;

		END

		IF NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_XUAT_VAT_TU WHERE MS_DH_XUAT_PT = @sCot1 AND MS_PT = @sCot2)
		BEGIN
		INSERT INTO dbo.IC_DON_HANG_XUAT_VAT_TU
		(MS_DH_XUAT_PT,MS_PT,SO_LUONG_CTU,SO_LUONG_THUC_XUAT,GHI_CHU,TG_PB,CHI_PHI,MS_PT_CT,TEN_PT_CT)
		SELECT @sCot1,@sCot2,0,0,'',1,0,'',''
		END

		INSERT INTO dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET
		(MS_DH_XUAT_PT,MS_PT,STT,MS_DH_NHAP_PT,MS_VI_TRI,SL_VT,ID_XUAT)
		SELECT TOP 1 @sCot1,@sCot2,((SELECT ISNULL(MAX(STT),0) FROM IC_DON_HANG_XUAT_VAT_TU_CHI_TIET WHERE MS_DH_XUAT_PT = @sCot1 AND MS_PT = @sCot2 AND MS_DH_NHAP_PT = @sCot3) + 1)
		,@sCot3,MS_VI_TRI,0,ID FROM dbo.VI_TRI_KHO_VAT_TU WHERE MS_PT = @sCot2 AND MS_DH_NHAP_PT = @sCot3 AND SL_VT > 0
	
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION ScanPTX
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION ScanPTX;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
	
END


IF(@sDanhMuc ='SAVE_PHIEU_XUAT_KHO')
BEGIN
	BEGIN TRANSACTION UpPX
	BEGIN TRY
		--bCot them
		IF(@bcot1 = 1)
		BEGIN
		---thêm Đơn hàng xuất
		---kiểm tra @sCot1 là số phiếu xuất kho có tồn tại thì báo ngược lại
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_XUAT WHERE MS_DH_XUAT_PT = @sCot1)
		BEGIN
			SELECT 0 AS MA,(dbo.AUTO_CREATE_SO_PHIEU_XUAT(GETDATE())) AS [NAME]
		END
			INSERT INTO [dbo].[IC_DON_HANG_XUAT]
           ([MS_DH_XUAT_PT],[SO_PHIEU_XN]
           ,[GIO],[NGAY],[MS_KHO]
           ,[MS_DANG_XUAT],[NGUOI_NHAN]
           ,[NGAY_CHUNG_TU],[SO_CHUNG_TU]
           ,[MS_PHIEU_BAO_TRI],[GHI_CHU]
           ,[LOCK],[THU_KHO]
           ,[MS_BP_CHIU_PHI]
           ,NGUOI_LAP,MS_LY_DO_XUAT_KT,CAN_CU,THU_KHO_KY,LY_DO_XUAT)
     VALUES
           (@sCot1,@sCot1 ,--msdonhangxuat
			@dCot1 ,@dCot1 ,@icot1 ,--gio ngay mskho
			@icot2,--msdangxuat
			@sCot2, --nguoinhan
			@dCot2,--ngay chung tu
			@sCot3 ,--sochungtu
			@sCot4,--msbt,
			ISNULL(@sCot5,''),--ghichu,
			0,--lock
			@UserName,--thukho
			@icot3,--msbpcp
			(SELECT TOP 1 B.HO +' ' + B.TEN FROM dbo.USERS A INNER JOIN  dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN WHERE A.USERNAME = @UserName),
			 @icot2,'','','')


		END
		ELSE
        BEGIN
		--sua du lieu
		UPDATE dbo.IC_DON_HANG_XUAT
		SET NGUOI_NHAN = @sCot2,
		SO_CHUNG_TU =@sCot3,
		GHI_CHU = @sCot5,
		NGAY_CHUNG_TU = @dCot2
		WHERE MS_DH_XUAT_PT = @sCot1
		END


	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION UpPX
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION UpPX;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
END

IF(@sDanhMuc ='SAVE_PHIEU_NHAP_KHO')
BEGIN
	BEGIN TRANSACTION UpPN
	BEGIN TRY
		--bCot them
		IF(@bcot1 = 1)
		BEGIN
		---thêm Đơn hàng xuất
		---kiểm tra @sCot1 là số phiếu nhap kho có tồn tại thì báo ngược lại
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1)
		BEGIN
			SELECT 0 AS MA,(dbo.AUTO_CREATE_SO_PHIEU_NHAP(GETDATE())) AS [NAME]
		END
			
			INSERT INTO dbo.IC_DON_HANG_NHAP(MS_DH_NHAP_PT,SO_PHIEU_XN,GIO,NGAY,MS_KHO,MS_DANG_NHAP,NGUOI_NHAP,NGAY_CHUNG_TU,SO_CHUNG_TU,GHI_CHU,
			LOCK,THU_KHO,MS_DDH,NGUOI_LAP,MS_DHX,MS_DH_XUAT_PT,MS_LY_DO_NHAP_KT)
			VALUES
			(   @sCot1,       -- MS_DH_NHAP_PT - nvarchar(14)
			    @sCot1,       -- SO_PHIEU_XN - nvarchar(20)
			    @dCot1, -- GIO - datetime
			    @dCot1, -- NGAY - datetime
			    @icot1,         -- MS_KHO - int
			    @icot2,         -- MS_DANG_NHAP - int
			    @sCot2,       -- NGUOI_NHAP - nvarchar(20)
			    @dCot2, -- NGAY_CHUNG_TU - datetime
			   @sCot3,       -- SO_CHUNG_TU - nvarchar(255)
			    @sCot4,       -- GHI_CHU - nvarchar(255)
			    0,      -- LOCK - bit
			    @UserName,       -- THU_KHO - nvarchar(50)
			    CASE @icot2 WHEN 3 THEN @sCot5 ELSE NULL END,       -- MS_DDH - nvarchar(30)
			    (SELECT TOP 1 B.HO +' ' + B.TEN FROM dbo.USERS A INNER JOIN  dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN WHERE A.USERNAME = @UserName),       -- NGUOI_LAP - nvarchar(250)
			    CASE @icot2 WHEN 6 THEN @sCot5 ELSE NULL END,       -- MS_DHX - nvarchar(14)
			  CASE @icot2 WHEN 6 THEN @sCot5 ELSE NULL END,       -- MS_DH_XUAT_PT - nvarchar(14)
			    @icot2       -- MS_LY_DO_NHAP_KT - nvarchar(50)
			    )
    
		END
		ELSE
        BEGIN
			--sua du lieu
			UPDATE dbo.IC_DON_HANG_NHAP
			SET NGUOI_NHAP = @sCot2,
			SO_CHUNG_TU =@sCot3,
			GHI_CHU = @sCot4,
			NGAY_CHUNG_TU = @dCot2
			WHERE MS_DH_NHAP_PT = @sCot1
		END

	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
	COMMIT TRANSACTION UpPN
	END TRY
	BEGIN CATCH  
		ROLLBACK TRANSACTION UpPN;   
		SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
	END CATCH
END

IF(@sDanhMuc ='ADD_PHU_TUNG_XUAT')
BEGIN
		BEGIN TRANSACTION UpAddPTXUATPPT
		BEGIN TRY
		
		SET @icot1 = (SELECT MS_KHO FROM dbo.IC_DON_HANG_XUAT WHERE MS_DH_XUAT_PT = @sCot1)

	SELECT DISTINCT MS_PT, MS_DH_NHAP_PT, MS_VI_TRI,SL_XUAT INTO #BTADDPTXUAT FROM OPENJSON(@json) 
	WITH (MS_PT NVARCHAR(30) '$.MS_PT',	MS_DH_NHAP_PT NVARCHAR(15) '$.MS_DH_NHAP_PT', MS_VI_TRI INT '$.MS_VI_TRI',SL_XUAT FLOAT '$.SL_XUAT');

	
	--spCMMSWEB

	---kiểm tra xuất kho không lớn hơn giá trị tồn
	IF EXISTS(	
	SELECT A.MS_PT,A.SL_XUAT,A.MS_DH_NHAP_PT , ISNULL(C.SL_VT,0) ,SUM(B.SL_VT)
	FROM #BTADDPTXUAT A
	INNER JOIN dbo.VI_TRI_KHO_VAT_TU B ON B.MS_PT = A.MS_PT AND B.MS_VI_TRI = A.MS_VI_TRI AND B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT
	LEFT JOIN (SELECT MS_PT,MS_DH_NHAP_PT,MS_VI_TRI,SL_VT  FROM dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET WHERE MS_DH_XUAT_PT =@sCot1) C ON C.MS_DH_NHAP_PT = B.MS_DH_NHAP_PT AND C.MS_PT = B.MS_PT AND C.MS_PT = B.MS_PT
	GROUP BY A.MS_PT,A.SL_XUAT,A.MS_DH_NHAP_PT,ISNULL(C.SL_VT,0)
	HAVING SUM(B.SL_VT) < A.SL_XUAT - ISNULL(C.SL_VT,0))
	BEGIN
		ROLLBACK TRANSACTION UpAddPTXUATPPT;   
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Số lượng xuất lớn hơn số lượng tồn!' ELSE 'Export quantity is greater than stock quantity!' END AS [NAME]
			RETURN;		
	END


	INSERT INTO dbo.IC_DON_HANG_XUAT_VAT_TU(MS_DH_XUAT_PT,MS_PT,SO_LUONG_CTU,SO_LUONG_THUC_XUAT,GHI_CHU,TG_PB,CHI_PHI,MS_PT_CT,TEN_PT_CT)
	
	SELECT @sCot1,MS_PT,SUM(SL_XUAT),SUM(SL_XUAT),'',1,0,'','' FROM #BTADDPTXUAT A
	WHERE NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_XUAT_VAT_TU B WHERE A.MS_PT = B.MS_PT AND B.MS_DH_XUAT_PT = @sCot1)
	GROUP BY MS_PT

	UPDATE A
	SET A.SO_LUONG_THUC_XUAT = B.SL_XUAT
	FROM IC_DON_HANG_XUAT_VAT_TU A
	INNER JOIN #BTADDPTXUAT B ON A.MS_DH_XUAT_PT = @sCot1 AND A.MS_PT = B.MS_PT

	--insert vào vị trí kho
	UPDATE A
	SET A.SL_VT = (A.SL_VT + ISNULL(B.SL_VT,0)) - C.SL_XUAT 
	FROM dbo.VI_TRI_KHO_VAT_TU A
	INNER JOIN #BTADDPTXUAT C ON C.MS_PT = A.MS_PT AND C.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT AND C.MS_VI_TRI = A.MS_VI_TRI
	LEFT JOIN dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET B ON A.MS_PT = B.MS_PT AND B.MS_DH_XUAT_PT = @sCot1 AND A.MS_KHO = @icot1 AND A.MS_DH_NHAP_PT = B.MS_DH_NHAP_PT AND A.MS_VI_TRI = B.MS_VI_TRI
	
	INSERT INTO dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET(MS_DH_XUAT_PT,MS_PT,STT,MS_DH_NHAP_PT,MS_VI_TRI,SL_VT,ID_XUAT)
	SELECT @sCot1,MS_PT,ROW_NUMBER() OVER (PARTITION BY MS_PT ORDER BY MS_PT),MS_DH_NHAP_PT,MS_VI_TRI,SL_XUAT,(SELECT MAX(T.ID) FROM dbo.VI_TRI_KHO_VAT_TU T WHERE T.MS_KHO = @icot1 AND T.MS_VI_TRI = A.MS_VI_TRI AND T.MS_PT = A.MS_PT AND T.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT) FROM #BTADDPTXUAT A
	WHERE NOT EXISTS(SELECT * FROM dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET B WHERE A.MS_PT = B.MS_PT AND B.MS_DH_XUAT_PT = @sCot1 AND B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT AND B.MS_VI_TRI = A.MS_VI_TRI)

	UPDATE A
	SET A.SL_VT = B.SL_XUAT
	FROM dbo.IC_DON_HANG_XUAT_VAT_TU_CHI_TIET A
	INNER JOIN #BTADDPTXUAT B ON A.MS_DH_XUAT_PT = @sCot1 AND A.MS_DH_NHAP_PT = B.MS_DH_NHAP_PT AND A.MS_VI_TRI = B.MS_VI_TRI AND A.MS_PT = B.MS_PT

	COMMIT TRANSACTION UpAddPTXUATPPT
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION UpAddPTXUATPPT;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END

IF(@sDanhMuc ='ADD_PHU_TUNG_NHAP')
BEGIN
		BEGIN TRANSACTION UpAddPTNHAP
		BEGIN TRY
		
		SELECT @icot1 = MS_KHO,@icot2 = MS_DANG_NHAP,@sCot2 =(CASE MS_DANG_NHAP WHEN 6 THEN MS_DHX WHEN 3 THEN MS_DDH END) FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1
		SELECT DISTINCT MS_PT , 0 AS SO_LUONG INTO #BTADDPTNHAP FROM OPENJSON(@json) 
	    WITH (MS_PT NVARCHAR(30) '$.MS_PT');

		IF(@icot2 = 3)
		BEGIN
		--cập nhật Phụ tùng chưa nhập
			SELECT A.MS_PT,SL_DE_XUAT - ISNULL(B.SL_THUC_NHAP,0) AS SL INTO #TMPDX FROM dbo.DE_XUAT_MUA_HANG_CHI_TIET A
			LEFT JOIN  dbo.IC_DON_HANG_NHAP_VAT_TU B ON B.MS_PT = A.MS_PT AND B.MS_DH_NHAP_PT =@sCot1
			LEFT JOIN dbo.IC_DON_HANG_NHAP C ON C.MS_DH_NHAP_PT = B.MS_DH_NHAP_PT
			WHERE MS_DE_XUAT =@sCot2

			UPDATE A
			SET A.SO_LUONG = B.SL
			FROM #BTADDPTNHAP A
			INNER JOIN #TMPDX B ON A.MS_PT = B.MS_PT

		END
		IF(@icot2 = 6)
		BEGIN
			SELECT A.MS_PT,A.SO_LUONG_THUC_XUAT - ISNULL(B.SL_TT,0) AS SL into #TMPPX FROM dbo.IC_DON_HANG_XUAT_VAT_TU A
			LEFT JOIN PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO B ON B.MS_DH_XUAT_PT = A.MS_DH_XUAT_PT
			WHERE A.MS_DH_XUAT_PT = @sCot2
			 
			UPDATE A
			SET A.SO_LUONG = B.SL
			FROM #BTADDPTNHAP A
			INNER JOIN #TMPPX B ON A.MS_PT = B.MS_PT
		END
		--spCMMSWEB

		INSERT INTO dbo.IC_DON_HANG_NHAP_VAT_TU(MS_DH_NHAP_PT,MS_PT,ID,SO_LUONG_CTU,SL_THUC_NHAP,DON_GIA,NGOAI_TE,TY_GIA,TY_GIA_USD,
		THANH_TIEN,MS_PT_CT,TEN_PT_CT,TAX,MS_CHI_TIET_DH,MS_DH_NHAP_PT_GOC,ID_GOC,TT_TAX,DON_GIA_GOC)
		SELECT @sCot1,A.MS_PT,ISNULL((SELECT MAX(ID) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1),0) +  ROW_NUMBER() OVER(ORDER BY A.MS_PT),B.SO_LUONG,B.SO_LUONG,DON_GIA,NGOAI_TE,TY_GIA,TY_GIA_USD,
		B.SO_LUONG * DON_GIA_GOC * A.TY_GIA,MS_PT_CT,TEN_PT_CT,0,@sCot2,@sCot1,ISNULL((SELECT MAX(ID) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1),0) +  ROW_NUMBER() OVER(ORDER BY A.MS_PT),0,DON_GIA_GOC 
		FROM IC_DON_HANG_NHAP_VAT_TU A
		INNER JOIN (
		SELECT T1.MS_PT,MAX(T2.SO_LUONG) AS SO_LUONG,MAX(MS_DH_NHAP_PT) AS MS_DH_NHAP_PT FROM IC_DON_HANG_NHAP_VAT_TU T1
		INNER JOIN #BTADDPTNHAP T2 ON T1.MS_PT = T2.MS_PT
		GROUP BY T1.MS_PT)  B ON A.MS_DH_NHAP_PT = B.MS_DH_NHAP_PT AND A.MS_PT = B.MS_PT


			---nhập vật tư không tồn tại trong IC_DON_HANG_NHAP_VAT_TU
		SELECT A.MS_PT,A.SO_LUONG INTO #BTPTNOTNHAP FROM #BTADDPTNHAP A WHERE NOT EXISTS (SELECT DISTINCT B.MS_PT FROM dbo.IC_DON_HANG_NHAP_VAT_TU B WHERE A.MS_PT = B.MS_PT)
		IF  EXISTS(SELECT * FROM #BTPTNOTNHAP)
		BEGIN


				--spCMMSWEB
			
			SELECT TOP 1 TI_GIA,TI_GIA_USD INTO #NT FROM dbo.TI_GIA_NT WHERE NGOAI_TE = (SELECT TOP 1 NGOAI_TE FROM dbo.NGOAI_TE WHERE MAC_DINH = 1)
			ORDER BY NGAY DESC

			INSERT INTO dbo.IC_DON_HANG_NHAP_VAT_TU(MS_DH_NHAP_PT,MS_PT,ID,SO_LUONG_CTU,SL_THUC_NHAP,DON_GIA,NGOAI_TE,TY_GIA,TY_GIA_USD,
		    THANH_TIEN,MS_PT_CT,TEN_PT_CT,TAX,MS_CHI_TIET_DH,MS_DH_NHAP_PT_GOC,ID_GOC,TT_TAX,DON_GIA_GOC)
			SELECT @sCot1,A.MS_PT,ISNULL((SELECT MAX(ID) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1),0) +  ROW_NUMBER() OVER(ORDER BY A.MS_PT),
			A.SO_LUONG,A.SO_LUONG,0,(SELECT TOP 1 NGOAI_TE FROM dbo.NGOAI_TE WHERE MAC_DINH = 1),(SELECT TOP 1 TI_GIA FROM #NT),(SELECT TOP 1 TI_GIA_USD FROM #NT),
			0,B.MS_PT,B.TEN_PT,0,@sCot2,@sCot1,ISNULL((SELECT MAX(ID) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1),0) +  ROW_NUMBER() OVER(ORDER BY A.MS_PT),
			0,0 FROM #BTPTNOTNHAP A
			INNER JOIN dbo.IC_PHU_TUNG B ON A.MS_PT = B.MS_PT
		END



		INSERT INTO dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET
		(MS_DH_NHAP_PT,MS_PT,MS_VI_TRI,ID,SL_VT)
		SELECT @sCot1,A.MS_PT,B.MS_VI_TRI,C.ID,A.SO_LUONG FROM #BTADDPTNHAP A 
		INNER JOIN dbo.IC_PHU_TUNG_KHO B ON B.MS_PT = A.MS_PT AND B.MS_KHO =  17
		INNER JOIN  dbo.IC_DON_HANG_NHAP_VAT_TU C ON C.MS_PT = B.MS_PT
		WHERE C.MS_DH_NHAP_PT = @sCot1

	

			--kiểm tra có chi phí không
	IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT = @sCot1 AND TONG_CP > 0)
	BEGIN
		--cập nhật tổng chi phí nhập khẩu theo số lượng
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 1)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 1)
			
			SET @icot2 = (SELECT SUM(SL_THUC_NHAP) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_NHAP_KHAU_VT = ((@fcot1/ @icot2) * SL_THUC_NHAP)
			WHERE MS_DH_NHAP_PT = @sCot1

		END
		---cập nhật tổng chi phí khác theo số lượng
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 10)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 10 )
			
			SET @icot2 = (SELECT SUM(SL_THUC_NHAP) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_KHAC_VT =  ((@fcot1/ @icot2) * SL_THUC_NHAP)
			WHERE MS_DH_NHAP_PT = @sCot1
		END
		--cập nhật tổng chi phí nhập khẩu theo giá trị
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 1)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 1)
			
			SET @fcot2 = (SELECT SUM(DON_GIA_GOC * SL_THUC_NHAP * TY_GIA) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_NHAP_KHAU_VT = ((@fcot1/ @fcot2) * (DON_GIA_GOC * SL_THUC_NHAP * TY_GIA ))
			WHERE MS_DH_NHAP_PT = @sCot1
		END
		---cập nhật tổng chi phí khác giá trị
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 10)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 10)
			
			SET @fcot2 = (SELECT SUM(DON_GIA_GOC * SL_THUC_NHAP * TY_GIA) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_KHAC_VT =  ((@fcot1/ @fcot2) * (DON_GIA_GOC * SL_THUC_NHAP * TY_GIA))
			WHERE MS_DH_NHAP_PT = @sCot1
		END

		UPDATE dbo.IC_DON_HANG_NHAP_VAT_TU 
		SET DON_GIA = (DON_GIA_GOC * TY_GIA) + (TONG_CP_KHAC_VT/SL_THUC_NHAP) + (TONG_CP_NHAP_KHAU_VT /SL_THUC_NHAP),
		THANH_TIEN = (DON_GIA * SL_THUC_NHAP) + TT_TAX
		WHERE MS_DH_NHAP_PT = @sCot1
	END


	--spCMMSWEB
		
	COMMIT TRANSACTION UpAddPTNHAP
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION UpAddPTNHAP;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END


IF(@sDanhMuc ='SAVE_VI_TRI')
BEGIN
		BEGIN TRANSACTION SaveViTriNhap
		BEGIN TRY
		
		SELECT @icot1 = MS_KHO FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1
		SELECT DISTINCT MS_VI_TRI,SO_LUONG INTO #BTSAVEVITRI FROM OPENJSON(@json) 
	    WITH(MS_VI_TRI INT '$.MS_VI_TRI',SO_LUONG float '$.SO_LUONG');
		---kiểm tra tổng sl vị trí có bằng số lượng Phiếu nhập

		IF((SELECT SL_THUC_NHAP FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2) != 
	(SELECT SUM(SO_LUONG) FROM #BTSAVEVITRI))
	BEGIN
		ROLLBACK TRANSACTION SaveViTriNhap;   
		SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Số lượng trong vị trí không cân với số lượng thực nhập!' ELSE 'The quantity in the position is not equal to the actual quantity entered!' END	 AS [NAME]
		RETURN;
	END
		--spCMMSWEB

	
	INSERT INTO dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET
	(
	    MS_DH_NHAP_PT,
	    MS_PT,
	    MS_VI_TRI,
	    ID,
	    SL_VT
	)
	SELECT @sCot1,@sCot2,A.MS_VI_TRI,(SELECT ID FROM dbo.IC_DON_HANG_NHAP_VAT_TU where MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2),A.SO_LUONG 
	FROM #BTSAVEVITRI A
	WHERE A.SO_LUONG > 0 AND NOT EXISTS(SELECT * FROM IC_DON_HANG_NHAP_VAT_TU_CHI_TIET B 
	WHERE B.MS_DH_NHAP_PT = @sCot1 AND B.MS_PT = @sCot2 AND B.MS_VI_TRI = A.MS_VI_TRI)

	UPDATE A
	SET A.SL_VT = B.SO_LUONG
   FROM dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET A
   INNER JOIN #BTSAVEVITRI B ON  A.MS_DH_NHAP_PT = @sCot1 AND A.MS_PT = @sCot2 AND A.MS_VI_TRI = B.MS_VI_TRI
   WHERE B.SO_LUONG > 0

   delete IC_DON_HANG_NHAP_VAT_TU_CHI_TIET WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2 AND SL_VT = 0

   delete VI_TRI_KHO_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2 AND SL_VT = 0

	INSERT INTO dbo.VI_TRI_KHO_VAT_TU(MS_KHO,MS_VI_TRI,MS_DH_NHAP_PT,MS_PT,ID,SL_VT)
	SELECT @icot1,MS_VI_TRI,@sCot1,@sCot2,ID,SL_VT FROM dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET A
	WHERE A.MS_DH_NHAP_PT = @sCot1 AND A.MS_PT = @sCot2 AND NOT EXISTS (SELECT * FROM VI_TRI_KHO_VAT_TU B WHERE A.MS_PT = B.MS_PT AND A.MS_VI_TRI = B.MS_VI_TRI AND A.MS_DH_NHAP_PT = B.MS_DH_NHAP_PT)
	
	UPDATE A
	SET A.SL_VT = B.SL_VT
	FROM dbo.VI_TRI_KHO_VAT_TU A
	INNER JOIN IC_DON_HANG_NHAP_VAT_TU_CHI_TIET B ON B.MS_VI_TRI = A.MS_VI_TRI AND B.MS_PT = A.MS_PT AND B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT
	WHERE B.MS_DH_NHAP_PT = @sCot1 AND B.MS_PT= @sCot1


	COMMIT TRANSACTION SaveViTriNhap
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION SaveViTriNhap;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END


IF(@sDanhMuc ='SAVE_CHI_PHI')
BEGIN
		BEGIN TRANSACTION SaveChiPhiNhap
		BEGIN TRY
		--[{"MS_CHI_PHI":1,"DANG_PB":"1","CHI_PHI":"2,000,000","GHI_CHU":"phí nhập khẩu"},{"MS_CHI_PHI":10,"DANG_PB":"1","CHI_PHI":"1,000,000","GHI_CHU":"phí khác"}]
		SELECT @icot1 = MS_KHO FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1

		SELECT DISTINCT MS_CHI_PHI,DANG_PB,CHI_PHI,GHI_CHU INTO #BTSAVECHIPHI FROM OPENJSON(@json) 
	    WITH(MS_CHI_PHI INT '$.MS_CHI_PHI',DANG_PB INT '$.DANG_PB',CHI_PHI FLOAT '$.CHI_PHI',GHI_CHU NVARCHAR(500) '$.GHI_CHU');
		---kiểm tra tổng sl vị trí có bằng số lượng Phiếu nhập

		INSERT INTO dbo.IC_DON_HANG_NHAP_CHI_PHI
		(
		    MS_DH_NHAP_PT,
		    MS_CHI_PHI,
		    DANG_PB,
		    TONG_CP,
		    GHI_CHU
		)
		SELECT @sCot1,A.MS_CHI_PHI,A.DANG_PB,A.CHI_PHI,A.GHI_CHU FROM #BTSAVECHIPHI A
		WHERE NOT EXISTS(SELECT * FROM IC_DON_HANG_NHAP_CHI_PHI B WHERE B.MS_DH_NHAP_PT = @sCot1 AND B.MS_CHI_PHI = A.MS_CHI_PHI)


		UPDATE A
		SET A.DANG_PB = B.DANG_PB,
		A.TONG_CP = B.CHI_PHI,
		A.GHI_CHU = B.GHI_CHU
		FROM IC_DON_HANG_NHAP_CHI_PHI A
		INNER JOIN #BTSAVECHIPHI B ON A.MS_DH_NHAP_PT = @sCot1 AND A.MS_CHI_PHI = B.MS_CHI_PHI
		
		--cập nhật tổng chi phí nhập khẩu theo số lượng
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 1)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 1)
			
			SET @icot2 = (SELECT SUM(SL_THUC_NHAP) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_NHAP_KHAU_VT = ((@fcot1/ @icot2) * SL_THUC_NHAP)
			WHERE MS_DH_NHAP_PT = @sCot1

		END
		---cập nhật tổng chi phí khác theo số lượng
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 10)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 10 )
			
			SET @icot2 = (SELECT SUM(SL_THUC_NHAP) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_KHAC_VT =  ((@fcot1/ @icot2) * SL_THUC_NHAP)
			WHERE MS_DH_NHAP_PT = @sCot1
		END

		--cập nhật tổng chi phí nhập khẩu theo giá trị
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 1)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 1)
			
			SET @fcot2 = (SELECT SUM(DON_GIA_GOC * SL_THUC_NHAP * TY_GIA) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_NHAP_KHAU_VT = ((@fcot1/ @fcot2) * (DON_GIA_GOC * SL_THUC_NHAP * TY_GIA ))
			WHERE MS_DH_NHAP_PT = @sCot1
		END

		---cập nhật tổng chi phí khác giá trị
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 10)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 10)
			
			SET @fcot2 = (SELECT SUM(DON_GIA_GOC * SL_THUC_NHAP * TY_GIA) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_KHAC_VT =  ((@fcot1/ @fcot2) * (DON_GIA_GOC * SL_THUC_NHAP * TY_GIA))
			WHERE MS_DH_NHAP_PT = @sCot1
		END

		UPDATE dbo.IC_DON_HANG_NHAP_VAT_TU 
		SET DON_GIA = (DON_GIA_GOC * TY_GIA) + (TONG_CP_KHAC_VT/SL_THUC_NHAP) + (TONG_CP_NHAP_KHAU_VT /SL_THUC_NHAP),
		THANH_TIEN = (DON_GIA * SL_THUC_NHAP) + TT_TAX
		WHERE MS_DH_NHAP_PT = @sCot1

	COMMIT TRANSACTION SaveChiPhiNhap
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION SaveChiPhiNhap;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END



IF(@sDanhMuc ='SAVE_PHU_TUNG_NHAP')
BEGIN
		BEGIN TRANSACTION UpSavePTNHAP
		BEGIN TRY
		
		SELECT @icot1 = MS_KHO,@icot2 = MS_DANG_NHAP,@sCot2 =(CASE MS_DANG_NHAP WHEN 6 THEN MS_DHX WHEN 3 THEN MS_DDH END) FROM dbo.IC_DON_HANG_NHAP WHERE MS_DH_NHAP_PT = @sCot1

		SELECT DISTINCT MS_PT,SO_LUONG,DON_GIA,VAT,NGOAI_TE INTO #BTSAVEPTNHAP FROM OPENJSON(@json) 
	    WITH(MS_PT NVARCHAR(30) '$.MS_PT',SO_LUONG float '$.SO_LUONG',DON_GIA FLOAT '$.DON_GIA',VAT FLOAT '$.VAT',NGOAI_TE NVARCHAR(30) '$.NGOAI_TE');
	
		IF(@icot2 = 6)
		BEGIN
		--kiểm tra có nhập quá trong phiếu xuất or phiếu bảo trì hay không
		--ssf	
		SELECT T.MS_PT ,SUM(T.SL_THUC_NHAP) AS SL_THUC_NHAP INTO #TMPNHAPXUAT  FROM (
		SELECT B.MS_PT,B.SL_THUC_NHAP FROM dbo.IC_DON_HANG_NHAP A
		INNER JOIN dbo.IC_DON_HANG_NHAP_VAT_TU B ON B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT
		WHERE MS_DHX = @sCot2 AND A.MS_DH_NHAP_PT != @sCot1
		UNION
		SELECT MS_PT,SO_LUONG FROM #BTSAVEPTNHAP) T
		GROUP BY T.MS_PT

		IF EXISTS(SELECT *
		FROM #TMPNHAPXUAT A
		INNER JOIN dbo.IC_DON_HANG_XUAT_VAT_TU B ON B.MS_DH_XUAT_PT = @sCot2 AND A.MS_PT = B.MS_PT
		LEFT JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO C ON C.MS_DH_XUAT_PT = B.MS_DH_XUAT_PT AND C.MS_PT = B.MS_PT
		WHERE  B.SO_LUONG_THUC_XUAT - (ISNULL(C.SL_TT,0) + A.SL_THUC_NHAP) < 0)
		BEGIN
			ROLLBACK TRANSACTION UpSavePTNHAP;   
			SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Số lượng nhập lại lớn hơn số lượng xuất!' ELSE 'The number of re-imports is greater than the quantity of exports!' END	 AS [NAME]
			RETURN;
		END
		END
		IF(@icot2 = 3)
		BEGIN
			
			--kiểm tra nhập từ đề xuất
			--ssf	
			SELECT T.MS_PT ,SUM(T.SL_THUC_NHAP) AS SL_THUC_NHAP INTO #TMPNHAPDDH  FROM (
			SELECT B.MS_PT,B.SL_THUC_NHAP FROM dbo.IC_DON_HANG_NHAP A
			INNER JOIN dbo.IC_DON_HANG_NHAP_VAT_TU B ON B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT
			WHERE A.MS_DDH = @sCot2 AND A.MS_DH_NHAP_PT != @sCot1
			UNION
			SELECT MS_PT,SO_LUONG FROM #BTSAVEPTNHAP) T
			GROUP BY T.MS_PT

			IF EXISTS(SELECT *
			FROM #TMPNHAPDDH A
			INNER JOIN dbo.DE_XUAT_MUA_HANG_CHI_TIET B ON B.MS_DE_XUAT = @sCot2 AND A.MS_PT = B.MS_PT
			WHERE (B.SL_DA_DUYET - A.SL_THUC_NHAP) < 0)
			BEGIN
				ROLLBACK TRANSACTION UpSavePTNHAP;   
				SELECT 0 AS MA, CASE @NNgu WHEN 0 then N'Số lượng nhập  lớn hơn số lượng đặt hàng!' ELSE 'Import quantity is greater than order quantity!' END	 AS [NAME]
				RETURN;
			END
		END

		UPDATE A
		SET A.SO_LUONG_CTU = B.SO_LUONG,
		A.SL_THUC_NHAP = B.SO_LUONG,
		A.DON_GIA_GOC = B.DON_GIA,
		A.DON_GIA = B.DON_GIA * TY_GIA,
		A.NGOAI_TE = B.NGOAI_TE,
		A.TY_GIA = C.TI_GIA,
		A.TY_GIA_USD = C.TI_GIA_USD,
		A.TAX = B.VAT,
		A.TT_TAX = (B.SO_LUONG * B.DON_GIA * B.VAT)/100,
		A.THANH_TIEN =  (B.SO_LUONG * B.DON_GIA * C.TI_GIA) + ((B.SO_LUONG * B.DON_GIA * TY_GIA * B.VAT)/100)
		FROM dbo.IC_DON_HANG_NHAP_VAT_TU A
		INNER JOIN #BTSAVEPTNHAP B ON A.MS_DH_NHAP_PT = @sCot1 AND A.MS_PT = B.MS_PT
		INNER JOIN (SELECT NGOAI_TE,TI_GIA,TI_GIA_USD,MAX(NGAY_NHAP) NGAY FROM dbo.TI_GIA_NT
		GROUP BY NGOAI_TE,TI_GIA,TI_GIA_USD) C ON B.NGOAI_TE = C.NGOAI_TE
		
		---kiểm tra trong bảng chi tiết có vị trí mặc định không nếu có thì cập nhật hết vào mặc định
		IF EXISTS(SELECT * FROM IC_DON_HANG_NHAP_VAT_TU_CHI_TIET A INNER JOIN dbo.VI_TRI_KHO B ON B.MS_VI_TRI = A.MS_VI_TRI AND B.MS_KHO = @icot1
		WHERE MS_DH_NHAP_PT = @sCot1)
		BEGIN
			UPDATE A
			SET A.SL_VT = C.SO_LUONG - ISNULL((SELECT SUM(SL_VT) 
			FROM IC_DON_HANG_NHAP_VAT_TU_CHI_TIET T 
			WHERE T.MS_DH_NHAP_PT = @sCot1 AND T.MS_PT = A.MS_PT AND T.MS_VI_TRI != A.MS_VI_TRI),0)
			FROM dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET A
			INNER JOIN dbo.VI_TRI_KHO B ON B.MS_VI_TRI = A.MS_VI_TRI AND B.MS_KHO = @icot1
			INNER JOIN #BTSAVEPTNHAP C ON A.MS_PT = C.MS_PT
			WHERE A.MS_DH_NHAP_PT = @sCot1

			
		END
		ELSE
        BEGIN
			SELECT A.MS_DH_NHAP_PT,
                   A.MS_PT,
                   MIN(A.MS_VI_TRI) AS MS_VI_TRI,
                   B.SO_LUONG 
				   INTO #BTPTNHAP
				   FROM IC_DON_HANG_NHAP_VAT_TU_CHI_TIET A
			INNER JOIN #BTSAVEPTNHAP B ON A.MS_PT = B.MS_PT
			WHERE MS_DH_NHAP_PT = @sCot1 

			UPDATE A
			SET A.SL_VT = B.SO_LUONG - (SELECT SUM(SL_VT) FROM IC_DON_HANG_NHAP_VAT_TU_CHI_TIET T WHERE T.MS_DH_NHAP_PT = @sCot1 AND T.MS_PT = A.MS_PT AND T.MS_VI_TRI != A.MS_VI_TRI)
			FROM dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET A
			INNER JOIN #BTPTNHAP B ON A.MS_DH_NHAP_PT = B.MS_DH_NHAP_PT AND A.MS_PT = B.MS_PT AND A.MS_VI_TRI = B.MS_VI_TRI
			WHERE A.MS_DH_NHAP_PT = @sCot1
		END
	--spCMMSWEB

	INSERT INTO dbo.VI_TRI_KHO_VAT_TU
	(
	    MS_KHO,
	    MS_VI_TRI,
	    MS_DH_NHAP_PT,
	    MS_PT,
	    ID,
	    SL_VT
	)
	SELECT @icot1,MS_VI_TRI,@sCot1,MS_PT,ID,SL_VT FROM dbo.IC_DON_HANG_NHAP_VAT_TU_CHI_TIET A
	WHERE MS_DH_NHAP_PT = @sCot1 AND NOT EXISTS (SELECT * FROM VI_TRI_KHO_VAT_TU B WHERE A.MS_PT = B.MS_PT AND A.MS_VI_TRI = B.MS_VI_TRI AND A.MS_DH_NHAP_PT = B.MS_DH_NHAP_PT)
	
	UPDATE A
	SET A.SL_VT = B.SL_VT
	FROM dbo.VI_TRI_KHO_VAT_TU A
	INNER JOIN IC_DON_HANG_NHAP_VAT_TU_CHI_TIET B ON B.MS_VI_TRI = A.MS_VI_TRI AND B.MS_PT = A.MS_PT AND B.MS_DH_NHAP_PT = A.MS_DH_NHAP_PT
	WHERE B.MS_DH_NHAP_PT = @sCot1

	--kiểm tra có chi phí không
	IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT = @sCot1 AND TONG_CP > 0)
	BEGIN
		--cập nhật tổng chi phí nhập khẩu theo số lượng
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 1)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 1)
			
			SET @icot2 = (SELECT SUM(SL_THUC_NHAP) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_NHAP_KHAU_VT = ((@fcot1/ @icot2) * SL_THUC_NHAP)
			WHERE MS_DH_NHAP_PT = @sCot1

		END
		---cập nhật tổng chi phí khác theo số lượng
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 10)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 1 AND MS_CHI_PHI = 10 )
			
			SET @icot2 = (SELECT SUM(SL_THUC_NHAP) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_KHAC_VT =  ((@fcot1/ @icot2) * SL_THUC_NHAP)
			WHERE MS_DH_NHAP_PT = @sCot1
		END
		--cập nhật tổng chi phí nhập khẩu theo giá trị
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 1)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 1)
			
			SET @fcot2 = (SELECT SUM(DON_GIA_GOC * SL_THUC_NHAP * TY_GIA) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_NHAP_KHAU_VT = ((@fcot1/ @fcot2) * (DON_GIA_GOC * SL_THUC_NHAP * TY_GIA ))
			WHERE MS_DH_NHAP_PT = @sCot1
		END
		---cập nhật tổng chi phí khác giá trị
		IF EXISTS(SELECT * FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 10)
		BEGIN
			SET @fcot1 = (SELECT SUM(TONG_CP) FROM dbo.IC_DON_HANG_NHAP_CHI_PHI WHERE MS_DH_NHAP_PT =@sCot1 AND DANG_PB = 2 AND MS_CHI_PHI = 10)
			
			SET @fcot2 = (SELECT SUM(DON_GIA_GOC * SL_THUC_NHAP * TY_GIA) FROM dbo.IC_DON_HANG_NHAP_VAT_TU WHERE MS_DH_NHAP_PT = @sCot1)

			UPDATE IC_DON_HANG_NHAP_VAT_TU
			SET  TONG_CP_KHAC_VT =  ((@fcot1/ @fcot2) * (DON_GIA_GOC * SL_THUC_NHAP * TY_GIA))
			WHERE MS_DH_NHAP_PT = @sCot1
		END

		UPDATE dbo.IC_DON_HANG_NHAP_VAT_TU 
		SET DON_GIA = (DON_GIA_GOC * TY_GIA) + (TONG_CP_KHAC_VT/SL_THUC_NHAP) + (TONG_CP_NHAP_KHAU_VT /SL_THUC_NHAP),
		THANH_TIEN = (DON_GIA * SL_THUC_NHAP) + TT_TAX
		WHERE MS_DH_NHAP_PT = @sCot1
	END


	COMMIT TRANSACTION UpSavePTNHAP
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION UpSavePTNHAP;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END


IF(@sDanhMuc ='SAVE_THONG_TIN_PHU_TUNG')
BEGIN
		BEGIN TRANSACTION SaveThongTinPT
		BEGIN TRY
		
		UPDATE dbo.IC_DON_HANG_NHAP_VAT_TU 
		SET BAO_HANH_DEN_NGAY = @dCot1,
		XUAT_XU = @sCot3,
		TY_GIA = @fcot1
		WHERE MS_DH_NHAP_PT = @sCot1 AND MS_PT = @sCot2

	COMMIT TRANSACTION SaveThongTinPT
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION SaveThongTinPT;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END


IF(@sDanhMuc ='LOCK_PHIEU_NHAP_KHO')
BEGIN
		BEGIN TRANSACTION lockPN
		BEGIN TRY
		UPDATE dbo.IC_DON_HANG_NHAP SET LOCK=1
		WHERE MS_DH_NHAP_PT=@sCot1

	COMMIT TRANSACTION lockPN
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION lockPN;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END


IF(@sDanhMuc ='LOCK_PHIEU_XUAT_KHO')
BEGIN
		BEGIN TRANSACTION lockPX
		BEGIN TRY
		UPDATE IC_DON_HANG_XUAT SET LOCK=1
		WHERE MS_DH_XUAT_PT=@sCot1

	COMMIT TRANSACTION lockPX
	SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION lockPX;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END

IF(@sDanhMuc ='GET_THOI_GIAN_DUNG_MAY')
BEGIN
			

			
			IF EXISTS(SELECT * FROM THOI_GIAN_DUNG_MAY WHERE MS_PBT = @sCot1)
			BEGIN
			 SELECT (SELECT TOP 1 MS_NGUYEN_NHAN FROM  THOI_GIAN_DUNG_MAY WHERE MS_PBT = @sCot1) AS MS_NGUYEN_NHAN  ,MIN(TU_GIO) AS TU_GIO, MAX(DEN_GIO) AS DEN_GIO FROM dbo.THOI_GIAN_DUNG_MAY WHERE MS_PBT = @sCot1
			END
			ELSE
			BEGIN
      
			SELECT CONVERT(INT,NULL) AS MS_NGUYEN_NHAN,MIN(CONVERT(DATETIME,CONVERT(NVARCHAR(10),NGAY,101) + ' ' + CONVERT(NVARCHAR(10),TU_GIO,108))) AS TU_GIO,MAX(CONVERT(DATETIME,CONVERT(NVARCHAR(10),DEN_NGAY,101) + ' ' + CONVERT(NVARCHAR(10),DEN_GIO,108))) AS DEN_GIO  
			INTO #TGNMTMP
			FROM PHIEU_BAO_TRI_NHAN_SU  WHERE MS_PHIEU_BAO_TRI  = @sCot1
			UPDATE A
			SET A.MS_NGUYEN_NHAN = B.MS_NGUYEN_NHAN,
			 A.TU_GIO = CASE WHEN B.NGAY_XAY_RA IS NULL THEN A.TU_GIO ELSE (CONVERT(DATETIME,CONVERT(NVARCHAR(10),B.NGAY_XAY_RA,101) + ' ' + CONVERT(NVARCHAR(10),B.GIO_XAY_RA,108))) END	
			FROM #TGNMTMP A
			INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON B.MS_PBT = @sCot1
			SELECT * FROM #TGNMTMP
		END
END


IF(@sDanhMuc ='DELETE_NGUNG_MAY')
BEGIN
	
		DELETE dbo.THOI_GIAN_DUNG_MAY WHERE MS_PBT = @sCot1

		DBCC CHECKIDENT (THOI_GIAN_DUNG_MAY,RESEED,0)
		DBCC CHECKIDENT (THOI_GIAN_DUNG_MAY,RESEED)

		---Thông báo phiếu bảo trì hoành thành
	IF EXISTS(SELECT * FROM dbo.PHIEU_BAO_TRI A INNER JOIN dbo.YEU_CAU_NSD_CHI_TIET B ON A.MS_PHIEU_BAO_TRI = B.MS_PBT AND A.MS_PHIEU_BAO_TRI = @sCot1 AND ISNULL(B.NGAY_XAY_RA,'') !='')
	BEGIN
		
		EXEC dbo.spSentThongBao @ID = 0,          -- bigint
		                        @UName = @UserName,     -- nvarchar(50)
		                        @TableName = N'PHIEU_BAO_TRI_HOAN_THANH', -- nvarchar(50)
		                        @sCot1 = @sCot1,     -- nvarchar(50)
		                        @sCot2 = N'',     -- nvarchar(50)
		                        @sCot3 = N''      -- nvarchar(50)
		

	END

END

IF(@sDanhMuc ='ADD_NGUNG_MAY')
BEGIN
		SELECT @deviceID = MS_MAY FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1
	    DECLARE @ID_CA INT = (SELECT dbo.fnGetCa(@dCot1));

		DECLARE @ID_CHA BIGINT = (SELECT TOP 1 ID FROM dbo.THOI_GIAN_DUNG_MAY A WHERE MS_MAY = @deviceID AND DEN_GIO = @dCot1 AND A.MS_PBT = @sCot1);
		IF EXISTS(SELECT * FROM dbo.THOI_GIAN_DUNG_MAY WHERE MS_PBT = @sCot1)
		BEGIN
			IF( ISNULL(@ID_CHA,'') = '')
			BEGIN
				SET @ID_CHA = (SELECT MAX(ID) FROM dbo.THOI_GIAN_DUNG_MAY WHERE MS_PBT  = @sCot1)
			END
		END	
	    
		DECLARE	@NGAY_DUNG DATETIME = CONVERT(DATE,(CASE (SELECT TOP 1 CA_DEM FROM dbo.CA WHERE STT = @ID_CA) WHEN 1 THEN CONVERT(DATE, DATEADD(HOUR, -(DATEPART(HOUR, (SELECT TOP 1 DEN_GIO FROM dbo.CA WHERE STT = @ID_CA)) + (DATEPART(MINUTE, (SELECT TOP 1 DEN_GIO FROM dbo.CA WHERE STT = @ID_CA))/60)), @dCot1 )) ELSE @dCot1 END));

		INSERT INTO dbo.THOI_GIAN_DUNG_MAY(MS_MAY,CaID,TU_GIO,TU_GIO_GOC,DEN_GIO,DEN_GIO_GOC,MS_NGUYEN_NHAN,GHI_CHU,USERNAME,THOI_GIAN_SUA_CHUA,THOI_GIAN_SUA,ID_CHA,MS_NGUYEN_NHAN_GOC,NGAY_DUNG,MS_HE_THONG,MS_N_XUONG,MS_TO,MS_PBT)
		VALUES(@deviceID,@ID_CA,@dCot1,@dCot1,@dCot2,@dCot2,@icot1,'',@UserName,CONVERT(DECIMAL(18,2),DATEDIFF(SECOND,@dCot1,@dCot2))/60,CONVERT(DECIMAL(18,2),DATEDIFF(SECOND,@dCot1,@dCot2))/60,@ID_CHA,@icot1,@NGAY_DUNG,
		(SELECT TOP 1 MS_HE_THONG FROM dbo.MAY_HE_THONG WHERE MS_MAY = @deviceID),(SELECT TOP 1 MS_N_XUONG FROM dbo.MAY_NHA_XUONG WHERE MS_MAY = @deviceID),(SELECT MS_TO FROM dbo.USERS WHERE USERNAME = @UserName),@sCot1);
		SELECT CaID FROM dbo.THOI_GIAN_DUNG_MAY
END
	IF(@sDanhMuc ='GET_CA')
	BEGIN
	SELECT STT AS ID_CA, CASE WHEN TU_PHUT > 1440 THEN DATEADD(DAY,1,CONVERT(NVARCHAR(10),@dCot1,101) + ' ' + CONVERT(NVARCHAR(10),TU_GIO,108)) ELSE (CONVERT(NVARCHAR(10),@dCot1,101) + ' ' + CONVERT(NVARCHAR(10),TU_GIO,108)) END AS NGAY_BD,
	CASE WHEN DEN_PHUT > 1440 THEN DATEADD(DAY,1,(CONVERT(NVARCHAR(10),@dCot1,101) + ' ' + CONVERT(NVARCHAR(10),DEN_GIO,108))) ELSE (CONVERT(NVARCHAR(10),@dCot1,101) + ' ' + CONVERT(NVARCHAR(10),DEN_GIO,108)) END AS NGAY_KT FROM dbo.CA
	END
	IF(@sDanhMuc ='GET_LIST_THOI_GIAN_MGUNG_MAY')
	BEGIN
		SELECT A.TU_GIO,A.DEN_GIO,A.MS_NGUYEN_NHAN,
		CASE @NNgu WHEN 0 THEN C.TEN_NGUYEN_NHAN WHEN 1 THEN ISNULL(NULLIF(C.TEN_NGUYEN_NHAN_ANH,''),C.TEN_NGUYEN_NHAN)  END AS TEN_NGUYEN_NHAN,
		A.CaID AS ID_CA,
		CASE @NNgu WHEN 0 THEN B.CA WHEN 1 THEN ISNULL(NULLIF(B.CA_ANH,''),B.CA)  END AS TEN_CA
		FROM dbo.THOI_GIAN_DUNG_MAY A
		INNER JOIN  dbo.CA B ON A.CaID = B.STT
		INNER JOIN dbo.NGUYEN_NHAN_DUNG_MAY C ON C.MS_NGUYEN_NHAN = A.MS_NGUYEN_NHAN
		WHERE MS_PBT = @sCot1
		ORDER BY A.TU_GIO
	END

	IF(@sDanhMuc ='SAVE_THOI_GIAN_NGUNG_MAY')
BEGIN
		BEGIN TRANSACTION SaveNgungMay
		BEGIN TRY

		--[{"MS_NGUYEN_NHAN":"3","ID_CA":3,"TU_GIO":"15/02/2023 23:38:00","DEN_GIO":"16/02/2023 06:00:00"},

		SELECT DISTINCT MS_NGUYEN_NHAN,ID_CA,TU_GIO,DEN_GIO INTO #BTNNM FROM OPENJSON(@json) 
		WITH (MS_NGUYEN_NHAN INT '$.MS_NGUYEN_NHAN',ID_CA INT '$.ID_CA',TU_GIO DATETIME '$.TU_GIO',DEN_GIO DATETIME '$.DEN_GIO');

		---delete not exit
		DELETE A
		FROM dbo.THOI_GIAN_DUNG_MAY A 
		WHERE A.MS_PBT = @sCot1 AND NOT EXISTS (SELECT * FROM #BTNNM B WHERE A.TU_GIO = B.TU_GIO AND A.DEN_GIO = B.DEN_GIO)

		DBCC CHECKIDENT (THOI_GIAN_DUNG_MAY,RESEED,0)
		DBCC CHECKIDENT (THOI_GIAN_DUNG_MAY,RESEED)

		UPDATE  A
		SET A.MS_NGUYEN_NHAN = B.MS_NGUYEN_NHAN,
		A.UserEdit = @UserName,
		A.DateEdit = GETDATE(),
		A.CLOSED = 1
		FROM dbo.THOI_GIAN_DUNG_MAY A 
		INNER JOIN #BTNNM B ON A.TU_GIO = B.TU_GIO AND A.DEN_GIO = B.DEN_GIO
		WHERE A.MS_PBT = @sCot1

		SELECT @deviceID = MS_MAY FROM dbo.PHIEU_BAO_TRI WHERE MS_PHIEU_BAO_TRI = @sCot1


		INSERT INTO dbo.THOI_GIAN_DUNG_MAY(MS_MAY,CaID,TU_GIO,TU_GIO_GOC,DEN_GIO,DEN_GIO_GOC,MS_NGUYEN_NHAN,GHI_CHU,USERNAME,THOI_GIAN_SUA_CHUA,THOI_GIAN_SUA,ID_CHA,MS_NGUYEN_NHAN_GOC,NGAY_DUNG,MS_HE_THONG,MS_N_XUONG,MS_PBT,UserEdit,DateEdit,CLOSED,MS_TO)
		SELECT @deviceID,ID_CA,TU_GIO,TU_GIO,DEN_GIO,DEN_GIO,MS_NGUYEN_NHAN,'',@UserName,CONVERT(DECIMAL(18,2),DATEDIFF(SECOND,TU_GIO,DEN_GIO))/60,CONVERT(DECIMAL(18,2),DATEDIFF(SECOND,TU_GIO,DEN_GIO))/60,NULL,MS_NGUYEN_NHAN,
CONVERT(DATE,(CASE (SELECT TOP 1 CA_DEM FROM dbo.CA WHERE STT = ID_CA) WHEN 1 THEN CONVERT(DATE, DATEADD(HOUR, -(DATEPART(HOUR, (SELECT TOP 1 DEN_GIO FROM dbo.CA WHERE STT = ID_CA)) + (DATEPART(MINUTE, (SELECT TOP 1 DEN_GIO FROM dbo.CA WHERE STT = ID_CA))/60)), TU_GIO )) ELSE TU_GIO END)),
	(SELECT TOP 1 C.MS_HE_THONG FROM dbo.MAY_HE_THONG C WHERE MS_MAY = @deviceID),(SELECT TOP 1 D.MS_N_XUONG  FROM dbo.MAY_NHA_XUONG D WHERE MS_MAY = @deviceID),@sCot1,@UserName,GETDATE(),1,(SELECT MS_TO FROM dbo.USERS WHERE USERNAME = @UserName)
		FROM #BTNNM B
		WHERE NOT EXISTS (SELECT * FROM dbo.THOI_GIAN_DUNG_MAY A WHERE A.MS_PBT = @sCot1 AND A.TU_GIO = B.TU_GIO AND A.DEN_GIO = B.DEN_GIO)

		SELECT ID INTO #BTIDNM FROM dbo.THOI_GIAN_DUNG_MAY WHERE MS_PBT =@sCot1
		SET @ID_CHA = (SELECT Min(ID) FROM #BTIDNM)
		DECLARE @IDNM BIGINT
		WHILE @ID_CHA <= (SELECT MAX(ID) FROM #BTIDNM WHERE ID != (SELECT MAX(ID) FROM #BTIDNM))
		BEGIN
			SET @ID_CHA =(SELECT Min(ID) FROM #BTIDNM)
			DELETE #BTIDNM WHERE ID = @ID_CHA
			SET @IDNM =(SELECT Min(ID) FROM #BTIDNM)
			UPDATE dbo.THOI_GIAN_DUNG_MAY SET ID_CHA = @ID_CHA WHERE ID = @IDNM
		END

		

		SELECT 1 AS MA, CONVERT(NVARCHAR(50),NULL) AS [NAME]

		COMMIT TRANSACTION SaveNgungMay
		END TRY
		BEGIN CATCH  
			ROLLBACK TRANSACTION SaveNgungMay;   
			SELECT 0 AS MA, ERROR_MESSAGE() AS [NAME]
		END CATCH
END


	IF(@sDanhMuc ='GET_COMBO_NGUYEN_NHAN_NGUNG_MAY')
	BEGIN
	IF(@bcot1 = 1)
	BEGIN
		SELECT MS_NGUYEN_NHAN AS 'Value',CASE @NNgu WHEN 0 THEN TEN_NGUYEN_NHAN ELSE ISNULL(NULLIF(TEN_NGUYEN_NHAN_ANH,''),TEN_NGUYEN_NHAN)  END  AS 'Text' 
		FROM NGUYEN_NHAN_DUNG_MAY A 
		--WHERE A.BTDK = 1
		ORDER BY [Text]
	END
	ELSE
	BEGIN
		--lấy combo nguyên nhân theo loại mấy
	--	SELECT MS_NGUYEN_NHAN AS 'Value',CASE @NNgu WHEN 0 THEN TEN_NGUYEN_NHAN ELSE ISNULL(NULLIF(TEN_NGUYEN_NHAN_ANH,''),TEN_NGUYEN_NHAN)  END  AS 'Text' 
	--FROM NGUYEN_NHAN_DUNG_MAY A WHERE  NOT EXISTS (SELECT * FROM dbo.LOAI_MAY_NGUYEN_NHAN B WHERE A.MS_NGUYEN_NHAN = B.MS_NGUYEN_NHAN)
	--UNION
		SELECT A.MS_NGUYEN_NHAN AS 'Value',CASE @NNgu WHEN 0 THEN TEN_NGUYEN_NHAN ELSE ISNULL(NULLIF(TEN_NGUYEN_NHAN_ANH,''),TEN_NGUYEN_NHAN)  END  AS 'Text' 
		FROM NGUYEN_NHAN_DUNG_MAY A 
		WHERE (A.MS_LOAI_MAY = dbo.MGetLoaiMay(@deviceID) OR ISNULL(MS_LOAI_MAY,'') ='') 
		--AND A.BTDK = 1
		ORDER BY [Text]

END

END

	IF(@sDanhMuc ='VIEW_CHI_TIET_PBT')
	BEGIN
	
	SET @sCot2 = (SELECT STUFF((SELECT ';' + MO_TA_CV FROM ( SELECT DISTINCT CASE 0 WHEN 0 THEN B.MO_TA_CV WHEN 1 THEN ISNULL(NULLIF(B.MO_TA_CV_ANH,''),MO_TA_CV)  END AS MO_TA_CV FROM dbo.PHIEU_BAO_TRI_CONG_VIEC A
	INNER JOIN dbo.CONG_VIEC B ON B.MS_CV = A.MS_CV WHERE A.MS_PHIEU_BAO_TRI = @sCot1) AS T
	FOR XML PATH(''), TYPE).value('.', 'nvarchar(max)'), 1, 1, ''))
	
	SET @sCot3 =  (SELECT STUFF((SELECT DISTINCT ';' + A.MS_PT +'|' + CONVERT(NVARCHAR(10),ISNULL(A.SL_TT,A.SL_KH)) FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG A WHERE A.MS_PHIEU_BAO_TRI = @sCot1
	FOR XML PATH(''), TYPE).value('.', 'nvarchar(max)'), 1, 1, ''))

	SET @sCot4 = (SELECT STUFF((SELECT DISTINCT ';' + T.HO_TEN FROM (SELECT DISTINCT B.HO + ' ' + B.TEN AS HO_TEN FROM dbo.PHIEU_BAO_TRI_NHAN_SU A
	INNER JOIN dbo.CONG_NHAN B ON B.MS_CONG_NHAN = A.MS_CONG_NHAN WHERE A.MS_PHIEU_BAO_TRI = @sCot1) AS T
	FOR XML PATH(''), TYPE).value('.', 'nvarchar(max)'), 1, 1, ''))
	
	SET @sCot5 = (SELECT TOP 1 C.HO + ' ' +C.TEN  + ' ' + CONVERT(NVARCHAR(20),GETDATE(),103) FROM dbo.PHIEU_BAO_TRI A
	INNER JOIN dbo.CONG_NHAN C ON C.MS_CONG_NHAN = A.NGUOI_NGHIEM_THU
	WHERE A.MS_PHIEU_BAO_TRI =@sCot1)
	SELECT @sCot2 AS CONG_VIEC, @sCot3 AS PHU_TUNG, @sCot4 AS NGUOI_THUC_HIEN,@sCot5 AS NGUOI_NGHIEM_THU
	END
	
    IF(@sDanhMuc ='GET_MENU')
	BEGIN

	SET @icot1 = (SELECT GROUP_ID FROM dbo.USERS WHERE USERNAME = @UserName)

	SELECT 'MyEcomaint' , 1 AS STT
	UNION
	SELECT 'DiChuyenTB' , 2 AS STT
	UNION
	SELECT CASE WHEN EXISTS(SELECT * FROM dbo.USER_CHUC_NANG WHERE USERNAME = @UserName AND STT = 8)THEN 'NghiemThuPBT'ELSE ''END AS TEN, 3 AS STT
	UNION
	SELECT 'KiemKeTB' , 4 AS STT
	UNION 
	SELECT 'History' , 5 AS STT
	UNION 
	SELECT 'TheoDoiYCBT' , 6 AS STT
	UNION
	SELECT CASE WHEN EXISTS(SELECT * FROM dbo.NHOM_MENU WHERE GROUP_ID = @icot1 AND MENU_ID = N'mnuNhapkhoVTPT')THEN N'NhapKho'ELSE '' END , 7 AS STT
	UNION
	SELECT CASE WHEN EXISTS(SELECT * FROM dbo.NHOM_MENU WHERE GROUP_ID = @icot1 AND MENU_ID = N'mnuXuatkhoVTPT')THEN N'XuatKho'ELSE '' END , 8 AS STT
    UNION 
	SELECT 'BCXuatNhapTon', 9 AS STT
	UNION 
	SELECT 'Dashboard', 10 AS STT
	ORDER BY STT
END

END
GO

