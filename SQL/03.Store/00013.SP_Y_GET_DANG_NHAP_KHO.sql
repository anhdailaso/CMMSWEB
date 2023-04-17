
ALTER procedure [dbo].[SP_Y_GET_DANG_NHAP_KHO]
	@NNgu INT = 1
AS
BEGIN
select MS_DANG_NHAP, CASE @NNgu WHEN 0 THEN DANG_NHAP_VIET WHEN 1 THEN ISNULL(NULLIF(DANG_NHAP_ANH,''),DANG_NHAP_VIET) ELSE ISNULL(NULLIF(DANG_NHAP_HOA,''),DANG_NHAP_VIET) END  AS TEN_DANG_NHAP
from dbo.DANG_NHAP ORDER BY DANG_NHAP_VIET 

END
GO

