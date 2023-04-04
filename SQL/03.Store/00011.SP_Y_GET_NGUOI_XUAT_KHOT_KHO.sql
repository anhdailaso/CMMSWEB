IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SP_Y_GET_NGUOI_XUAT_KHOT_KHO')
   exec('CREATE PROCEDURE SP_Y_GET_NGUOI_XUAT_KHOT_KHO AS BEGIN SET NOCOUNT ON; END')
GO
ALTER PROCEDURE SP_Y_GET_NGUOI_XUAT_KHOT_KHO
	@User nvarchar(50) = 'trungnv'
AS
BEGIN

	SELECT Distinct MS_TO INTO #TO_USER FROM [dbo].[MGetDonViPhongBanUser](@User)

	SELECT *, -1 AS VTRO FROM 
	(SELECT A.MS_CONG_NHAN AS MS_NGUOI_NHAP , HO +' '+TEN AS TEN_NGUOI_NHAP,convert(bit,0) as KHACH_HANG
		FROM            dbo.CONG_NHAN AS A INNER JOIN
                         dbo.CONG_NHAN_VAI_TRO AS B ON A.MS_CONG_NHAN = B.MS_CONG_NHAN INNER JOIN
                         dbo.[TO] AS C ON A.MS_TO = C.MS_TO1 INNER JOIN
                         #TO_USER AS D ON C.MS_TO = D.MS_TO
	UNION
	SELECT MS_KH AS NGUOI_NHAP ,TEN_CONG_TY AS TEN_NGUOI_NHAP,convert(bit,1) as KHACH_HANG
	FROM dbo.KHACH_HANG
	) A 
UNION
	SELECT *, 5 AS VTRO FROM 
	(SELECT A.MS_CONG_NHAN AS NGUOI_NHAP , HO +' '+TEN AS TEN_NGUOI_NHAP,convert(bit,0) as KHACH_HANG
		FROM            dbo.CONG_NHAN AS A INNER JOIN
                         dbo.CONG_NHAN_VAI_TRO AS B ON A.MS_CONG_NHAN = B.MS_CONG_NHAN INNER JOIN
                         dbo.[TO] AS C ON A.MS_TO = C.MS_TO1 INNER JOIN
                         #TO_USER AS D ON C.MS_TO = D.MS_TO
		WHERE B.MS_VAI_TRO = 5
	UNION
	SELECT MS_KH AS MS_NGUOI_NHAP ,TEN_CONG_TY AS TEN_NGUOI_NHAP,convert(bit,1) as KHACH_HANG
	FROM dbo.KHACH_HANG
	) A 
	ORDER BY TEN_NGUOI_NHAP
END

GO

