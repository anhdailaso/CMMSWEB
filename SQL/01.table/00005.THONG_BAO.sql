
IF NOT  EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES Where Table_Schema = 'dbo' AND Table_Name ='THONG_BAO_SU_KIEN')
BEGIN
	CREATE TABLE [dbo].[THONG_BAO_SU_KIEN]
(
[ID_SU_KIEN] [int] NOT NULL,
[TABLE_NAME] [nvarchar] (50)  NULL,
[FORM_NAME] [nvarchar] (50)  NULL,
[TIEU_DE_MAIL] [nvarchar] (250)  NULL,
[TEN_SU_KIEN] [nvarchar] (100)  NULL,
[TEN_SU_KIEN_A] [nvarchar] (100)  NULL,
[TEN_SU_KIEN_H] [nvarchar] (100)  NULL,
[GHI_CHU] [nvarchar] (250)  NULL,
[INACTIVE] [bit] NULL CONSTRAINT [DF_THONG_BAO_SU_KIEN_INACTIVE] DEFAULT ((0))
) ON [PRIMARY]
END

IF NOT  EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES Where Table_Schema = 'dbo' AND Table_Name ='THONG_BAO_SU_KIEN_NGUOI_NHAN')
BEGIN
	CREATE TABLE [dbo].[THONG_BAO_SU_KIEN_NGUOI_NHAN]
	(
	[ID_SU_KIEN_CT] [int] NOT NULL,
	[ID_SU_KIEN] [int] NULL,
	[USERNAME] [nvarchar] (30)  NULL,
	[GHI_CHU] [nvarchar] (250)  NULL
	) ON [PRIMARY]
END

if not exists(select * from sys.columns 
            where Name = N'LOAI_GUI' and Object_ID = Object_ID(N'THONG_TIN_CHUNG'))
BEGIN
    ALTER TABLE dbo.THONG_TIN_CHUNG ADD LOAI_GUI INT
END   

IF NOT  EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES Where Table_Schema = 'dbo' AND Table_Name ='ACCESS_TOKEN')
BEGIN
	CREATE TABLE [dbo].[ACCESS_TOKEN]
	(
	[ID_TOKEN] [bigint] NOT NULL,
	[RefreshToken] [nvarchar] (max)  NULL,
	[AccessToken] [nvarchar] (max)  NULL,
	[AppID] [nvarchar] (max)  NULL,
	[SecretKey] [nvarchar] (max)  NULL,
	[TimeRefresh] [datetime] NULL,
	[API] [nvarchar] (250)  NULL
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
	ALTER TABLE [dbo].[ACCESS_TOKEN] ADD CONSTRAINT [PK_ACCESS_TOKEN] PRIMARY KEY CLUSTERED ([ID_TOKEN]) ON [PRIMARY]
END
