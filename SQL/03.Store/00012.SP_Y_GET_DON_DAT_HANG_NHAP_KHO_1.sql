
--EXEC SP_Y_GET_DON_DAT_HANG_NHAP_KHO_1 'ADMIN'
ALTER procedure [dbo].[SP_Y_GET_DON_DAT_HANG_NHAP_KHO_1]
	@USERNAME NVARCHAR(50)
AS
BEGIN
DECLARE @DE_XUAT BIT 
SELECT TOP 1 @DE_XUAT = DDH_DXMH
FROM dbo.THONG_TIN_CHUNG


IF (@DE_XUAT = 1 ) 
BEGIN
	SELECT DISTINCT TMP_1.MS_DON_DAT_HANG, TMP_1.MS_DON_DAT_HANG AS TEN_DON_DAT_HANG,CONVERT(BIT,1) AS DON_HANG 
	FROM (
	SELECT     dbo.DON_DAT_HANG.MS_DON_DAT_HANG, dbo.DON_DAT_HANG_CHI_TIET.MS_PT, SUM(dbo.DON_DAT_HANG_CHI_TIET.SL_DAT_HANG) 
						  AS SO_LUONG_DAT_HANG
	FROM         dbo.DON_DAT_HANG INNER JOIN
						  dbo.DON_DAT_HANG_CHI_TIET ON dbo.DON_DAT_HANG.MS_DON_DAT_HANG = dbo.DON_DAT_HANG_CHI_TIET.MS_DON_DAT_HANG
	WHERE     (dbo.DON_DAT_HANG.TRANG_THAI = 3)
	GROUP BY dbo.DON_DAT_HANG.MS_DON_DAT_HANG, dbo.DON_DAT_HANG_CHI_TIET.MS_PT
	)TMP_1
	LEFT JOIN (
	SELECT     dbo.IC_DON_HANG_NHAP.MS_DDH AS MS_DON_DAT_HANG, dbo.IC_DON_HANG_NHAP_VAT_TU.MS_PT, 
						  SUM(dbo.IC_DON_HANG_NHAP_VAT_TU.SL_THUC_NHAP) AS SO_LUONG_NHAP
	FROM         dbo.IC_DON_HANG_NHAP INNER JOIN
						  dbo.IC_DON_HANG_NHAP_VAT_TU ON dbo.IC_DON_HANG_NHAP.MS_DH_NHAP_PT = dbo.IC_DON_HANG_NHAP_VAT_TU.MS_DH_NHAP_PT
	GROUP BY dbo.IC_DON_HANG_NHAP.MS_DDH, dbo.IC_DON_HANG_NHAP_VAT_TU.MS_PT
	)TMP_2 ON TMP_1.MS_DON_DAT_HANG = TMP_2.MS_DON_DAT_HANG AND TMP_1.MS_PT = TMP_2.MS_PT
	WHERE TMP_1.SO_LUONG_DAT_HANG >=CASE WHEN TMP_2.SO_LUONG_NHAP IS NULL THEN 0 ELSE TMP_2.SO_LUONG_NHAP END
	UNION
	SELECT MS_DH_XUAT_PT ,CASE ISNULL(SO_PHIEU_XN,'')  WHEN '' THEN MS_DH_XUAT_PT ELSE SO_PHIEU_XN END , CONVERT(BIT,0) AS DON_HANG
	FROM IC_DON_HANG_XUAT WHERE  MS_DANG_XUAT = 1
	ORDER BY TMP_1.MS_DON_DAT_HANG DESC
	
END	
ELSE 
BEGIN

		SELECT     dbo.DE_XUAT_MUA_HANG.MS_DE_XUAT AS MS_DON_DAT_HANG, dbo.DE_XUAT_MUA_HANG_CHI_TIET.MS_PT, SUM(dbo.DE_XUAT_MUA_HANG_CHI_TIET.SL_DA_DUYET) 
							  AS SO_LUONG_DAT_HANG
		INTO #TMP_1 FROM         dbo.DE_XUAT_MUA_HANG INNER JOIN
							  dbo.DE_XUAT_MUA_HANG_CHI_TIET ON dbo.DE_XUAT_MUA_HANG.MS_DE_XUAT = dbo.DE_XUAT_MUA_HANG_CHI_TIET.MS_DE_XUAT INNER JOIN
							  dbo.NHOM_TO_PHONG_BAN ON dbo.DE_XUAT_MUA_HANG.MS_TO = dbo.NHOM_TO_PHONG_BAN.MS_TO INNER JOIN
							  dbo.USERS ON dbo.NHOM_TO_PHONG_BAN.GROUP_ID = dbo.USERS.GROUP_ID
		WHERE     (dbo.DE_XUAT_MUA_HANG.TRANG_THAI = 3) AND (dbo.USERS.USERNAME = @USERNAME)
		GROUP BY dbo.DE_XUAT_MUA_HANG.MS_DE_XUAT, dbo.DE_XUAT_MUA_HANG_CHI_TIET.MS_PT



		SELECT     dbo.IC_DON_HANG_NHAP.MS_DDH AS MS_DON_DAT_HANG, dbo.IC_DON_HANG_NHAP_VAT_TU.MS_PT, SUM(dbo.IC_DON_HANG_NHAP_VAT_TU.SL_THUC_NHAP) AS SO_LUONG_NHAP
		INTO #TMP_2 FROM         dbo.IC_DON_HANG_NHAP INNER JOIN
							  dbo.IC_DON_HANG_NHAP_VAT_TU ON dbo.IC_DON_HANG_NHAP.MS_DH_NHAP_PT = dbo.IC_DON_HANG_NHAP_VAT_TU.MS_DH_NHAP_PT INNER JOIN
							  dbo.NHOM_KHO ON dbo.IC_DON_HANG_NHAP.MS_KHO = dbo.NHOM_KHO.MS_KHO INNER JOIN
							  dbo.USERS ON dbo.NHOM_KHO.GROUP_ID = dbo.USERS.GROUP_ID
		WHERE     (dbo.USERS.USERNAME = @USERNAME)
		GROUP BY dbo.IC_DON_HANG_NHAP.MS_DDH, dbo.IC_DON_HANG_NHAP_VAT_TU.MS_PT	
		
		
	SELECT DISTINCT TMP_1.MS_DON_DAT_HANG, TMP_1.MS_DON_DAT_HANG AS TEN_DON_DAT_HANG ,CONVERT(INT,1) AS DON_HANG 
	FROM #TMP_1 AS TMP_1
	LEFT JOIN  #TMP_2 AS TMP_2 ON TMP_1.MS_DON_DAT_HANG = TMP_2.MS_DON_DAT_HANG AND TMP_1.MS_PT = TMP_2.MS_PT
	WHERE TMP_1.SO_LUONG_DAT_HANG >=CASE WHEN TMP_2.SO_LUONG_NHAP IS NULL THEN 0 ELSE TMP_2.SO_LUONG_NHAP END
UNION
	SELECT     dbo.IC_DON_HANG_XUAT.MS_DH_XUAT_PT, CASE ISNULL(SO_PHIEU_XN, '') WHEN '' THEN IC_DON_HANG_XUAT.MS_DH_XUAT_PT ELSE SO_PHIEU_XN END AS Expr1, CONVERT(INT, 0) AS DON_HANG
	FROM         dbo.IC_DON_HANG_XUAT INNER JOIN  dbo.IC_DON_HANG_XUAT_VAT_TU ON IC_DON_HANG_XUAT_VAT_TU.MS_DH_XUAT_PT = IC_DON_HANG_XUAT.MS_DH_XUAT_PT INNER JOIN
						  dbo.NHOM_KHO ON dbo.IC_DON_HANG_XUAT.MS_KHO = dbo.NHOM_KHO.MS_KHO INNER JOIN
						  dbo.USERS ON dbo.NHOM_KHO.GROUP_ID = dbo.USERS.GROUP_ID
	WHERE     (dbo.IC_DON_HANG_XUAT.MS_DANG_XUAT in (1, 4)) AND (dbo.USERS.USERNAME = @USERNAME) AND NOT EXISTS (SELECT * FROM (SELECT B.MS_DH_XUAT_PT FROM dbo.PHIEU_BAO_TRI A
INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG_CHI_TIET_KHO B ON B.MS_PHIEU_BAO_TRI = A.MS_PHIEU_BAO_TRI WHERE A.TINH_TRANG_PBT > 3 
UNION SELECT MS_DHX FROM dbo.IC_DON_HANG_NHAP ) T WHERE T.MS_DH_XUAT_PT = IC_DON_HANG_XUAT.MS_DH_XUAT_PT)	AND LOCK = 1
UNION
	SELECT     dbo.IC_DON_HANG_XUAT.MS_DH_XUAT_PT, CASE ISNULL(SO_PHIEU_XN, '') WHEN '' THEN MS_DH_XUAT_PT ELSE SO_PHIEU_XN END AS Expr1, CONVERT(INT, 10) AS DON_HANG
	FROM         dbo.IC_DON_HANG_XUAT INNER JOIN
						  dbo.NHOM_KHO ON dbo.IC_DON_HANG_XUAT.MS_KHO = dbo.NHOM_KHO.MS_KHO INNER JOIN
						  dbo.USERS ON dbo.NHOM_KHO.GROUP_ID = dbo.USERS.GROUP_ID
	WHERE     (dbo.IC_DON_HANG_XUAT.MS_DANG_XUAT = 10) AND (dbo.USERS.USERNAME = @USERNAME)	 and IC_DON_HANG_XUAT.LOCK = 1
ORDER BY MS_DON_DAT_HANG DESC	
END

END
GO
