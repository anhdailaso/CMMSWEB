
--SELECT * FROM PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG
--EXEC MTonKhoTheoPBT 'WO-201404000001', '-1'
ALTER PROC [dbo].MTonKhoTheoPBT 
	@PBT NVARCHAR(50),
	@MSKho NVARCHAR(50)
AS

CREATE TABLE #VTTon(
	MS_PT NVARCHAR(25), 
	SL_TON FLOAT
)


DECLARE @TTChung NVARCHAR(50)

SELECT TOP 1 @TTChung = [PRIVATE] FROM THONG_TIN_CHUNG
IF @TTChung = 'BARIA'
BEGIN
	DECLARE @SSql NVARCHAR(4000)
	SET @SSql = 'INSERT INTO #VTTon (MS_PT , SL_TON) SELECT MS_PT, SUM(SL_VT) FROM ' +  @MSKho + ' GROUP BY MS_PT'
	exec (@SSql)
END
ELSE
	INSERT INTO #VTTon exec dbo.MGetSLTonTheoKho @MSKho


SELECT  CONVERT(INT,NULL) AS STT,   A_1.MS_PT, A_1.TEN_PT, A_1.MS_PT_CTY, A_1.QUY_CACH, B_1.SL_TREN_PBT, SL_PBT_KHAC_1,SL_PBT_KHAC_2
, ISNULL(SL_PBT_KHAC_1,0) + ISNULL(SL_PBT_KHAC_2,0) AS TONG_SL_PBT_KHAC
, ISNULL(B_1.SL_TREN_PBT,0) +  ISNULL(SL_PBT_KHAC_1,0) + ISNULL(SL_PBT_KHAC_2,0) AS TONG
, ISNULL(SL_TON,0) AS SL_TON
INTO #TEMTK
FROM         (SELECT DISTINCT A.MS_PT, B.TEN_PT, B.MS_PT_CTY, B.QUY_CACH
                       FROM          dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG AS A INNER JOIN
                                              dbo.IC_PHU_TUNG AS B ON A.MS_PT = B.MS_PT
                       WHERE      (A.MS_PHIEU_BAO_TRI = @PBT)) AS A_1 
INNER JOIN (SELECT DISTINCT MS_PHIEU_BAO_TRI, MS_PT, SUM(SL_KH) AS SL_TREN_PBT
                            FROM          dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG AS A
                            GROUP BY MS_PHIEU_BAO_TRI, MS_PT
                            HAVING      (MS_PHIEU_BAO_TRI = @PBT)) AS B_1 ON 
 A_1.MS_PT = B_1.MS_PT
  
  LEFT JOIN
(
SELECT     dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PT, SUM(dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.SL_KH) AS SL_PBT_KHAC_1
FROM         dbo.PHIEU_BAO_TRI AS A INNER JOIN
                          (SELECT DISTINCT MS_MAY
                            FROM          dbo.MashjGetMayNhaXuong('-1',
                                                       (SELECT     TOP (1) MS_N_XUONG
                                                         FROM          dbo.MashjGetMayNhaXuong
                                                                                    ((SELECT     MS_MAY
                                                                                        FROM         dbo.PHIEU_BAO_TRI
                                                                                        WHERE     (MS_PHIEU_BAO_TRI = @PBT)), '-1',
                                                                                    (SELECT     NGAY_LAP
                                                                                      FROM          dbo.PHIEU_BAO_TRI
                                                                                      WHERE      (MS_PHIEU_BAO_TRI = @PBT)))),
                                                       (SELECT     NGAY_LAP
                                                         FROM          dbo.PHIEU_BAO_TRI
                                                         WHERE      (MS_PHIEU_BAO_TRI = @PBT))) AS MashjGetMayNhaXuong_1) AS B ON A.MS_MAY = B.MS_MAY INNER JOIN
                      dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG ON A.MS_PHIEU_BAO_TRI = dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PHIEU_BAO_TRI
WHERE     (A.MS_PHIEU_BAO_TRI <> @PBT) AND (A.MS_LOAI_BT = 1)
GROUP BY dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PT


)  AS C_1 ON A_1.MS_PT = C_1.MS_PT

  LEFT JOIN
(
SELECT     dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PT, SUM(dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.SL_KH) AS SL_PBT_KHAC_2
FROM         dbo.PHIEU_BAO_TRI AS A INNER JOIN
                          (SELECT DISTINCT MS_MAY
                            FROM          dbo.MashjGetMayNhaXuong('-1',
                                                       (SELECT     TOP (1) MS_N_XUONG
                                                         FROM          dbo.MashjGetMayNhaXuong
                                                                                    ((SELECT     MS_MAY
                                                                                        FROM         dbo.PHIEU_BAO_TRI
                                                                                        WHERE     (MS_PHIEU_BAO_TRI = @PBT)), '-1',
                                                                                    (SELECT     NGAY_LAP
                                                                                      FROM          dbo.PHIEU_BAO_TRI
                                                                                      WHERE      (MS_PHIEU_BAO_TRI = @PBT)))),
                                                       (SELECT     NGAY_LAP
                                                         FROM          dbo.PHIEU_BAO_TRI
                                                         WHERE      (MS_PHIEU_BAO_TRI = @PBT))) AS MashjGetMayNhaXuong_1) AS B ON A.MS_MAY = B.MS_MAY INNER JOIN
                      dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG ON A.MS_PHIEU_BAO_TRI = dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PHIEU_BAO_TRI
WHERE     (A.MS_PHIEU_BAO_TRI <> @PBT) AND (A.MS_LOAI_BT = 2)
GROUP BY dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG.MS_PT


)  AS D_1 ON A_1.MS_PT = D_1.MS_PT 
LEFT JOIN #VTTon E ON A_1.MS_PT = E.MS_PT 

SELECT STT,
       MS_PT,
       TEN_PT,
       MS_PT_CTY,
       QUY_CACH,
       SL_TREN_PBT,
       SL_PBT_KHAC_1,
       SL_PBT_KHAC_2,
       TONG_SL_PBT_KHAC,
       TONG,
       SL_TON,SL_TON - TONG_SL_PBT_KHAC AS SL_HUU_DUNG FROM #TEMTK

GO

