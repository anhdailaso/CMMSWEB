--DELETE THOI_GIAN_NGUNG_MAY_CT
--DELETE NGUYEN_NHAN_DUNG_MAY
--DELETE FROM dbo.THOI_GIAN_NGUNG_MAY
--DROP TABLE THOI_GIAN_NGUNG_MAY_CT
--DROP TABLE NGUYEN_NHAN_DUNG_MAY
--DROP TABLE THOI_GIAN_NGUNG_MAY
--DROP TABLE dbo.THOI_GIAN_NGUNG_MAY_CODE
--DROP TABLE dbo.THOI_GIAN_NGUNG_MAY_DAILY_TMP
--DROP TABLE dbo.THOI_GIAN_NGUNG_MAY_DO_HU_HONG_THEO_MAY_TMP
--DROP TABLE dbo.THOI_GIAN_NGUNG_MAY_SO_LAN
--DROP TABLE dbo.THOI_GIAN_NGUNG_MAY_PHU_TUNG
--DROP TABLE dbo.NGUYEN_NHAN_DUNG_MAY
--DROP TABLE dbo.DownTimeType
IF NOT  EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES Where Table_Schema = 'dbo' AND Table_Name ='DownTimeType')
BEGIN
	CREATE TABLE [dbo].[DownTimeType]
	(
	[ID_DownTime] [int] NOT NULL IDENTITY(1, 1),
	[DownTimeTypeName] [nvarchar] (250)  NULL,
	[DownTimeTypeNameA] [nvarchar] (250)  NULL,
	[DownTimeTypeNameH] [nvarchar] (250)  NULL,
	[Note] [nvarchar] (500)  NULL,
	[HMIType] [bit] NULL,
	[Planned] [bit] NULL,
	[NoEdit] [bit] NULL,
	[SORT] [int] NULL
	) ON [PRIMARY]
	ALTER TABLE [dbo].[DownTimeType] ADD CONSTRAINT [PK_DownTimeType] PRIMARY KEY CLUSTERED ([ID_DownTime]) ON [PRIMARY]
END

IF NOT  EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES Where Table_Schema = 'dbo' AND Table_Name ='NGUYEN_NHAN_DUNG_MAY')
BEGIN
     --thuc thi lệnh
CREATE TABLE [dbo].[NGUYEN_NHAN_DUNG_MAY]
(
[MS_NGUYEN_NHAN] [int] NOT NULL IDENTITY(1, 1),
[TEN_NGUYEN_NHAN] [nvarchar] (250)   NULL,
[HU_HONG] [bit] NOT NULL CONSTRAINT [DF_NGUYEN_NHAN_DUNG_MAY_HU_HONG] DEFAULT ((0)),
[BTDK] [bit] NULL CONSTRAINT [DF__NGUYEN_NHA__BTDK__2630A1B7] DEFAULT ((0)),
[TEN_NGUYEN_NHAN_ANH] [nvarchar] (250)   NULL,
[MAC_DINH] [bit] NULL CONSTRAINT [DF_NGUYEN_NHAN_DUNG_MAY_MAC_DINH] DEFAULT ((0)),
[Planned] [int] NULL,
[CauseCode] [nvarchar] (50)   NULL,
[DownTimeTypeID] [int] NULL,
[SORT] [int] NULL,
[OEE] [bit] NULL,
[DefineLevel] [decimal] (18, 2) NULL,
[AUTO_CYCLE] [int] NULL,
[MS_LOAI_MAY] NVARCHAR(20)
) ON [PRIMARY]
ALTER TABLE [dbo].[NGUYEN_NHAN_DUNG_MAY] ADD CONSTRAINT [PK_NGUYEN_NHAN_DUNG_MAY] PRIMARY KEY CLUSTERED ([MS_NGUYEN_NHAN]) ON [PRIMARY]
ALTER TABLE [dbo].[NGUYEN_NHAN_DUNG_MAY] ADD CONSTRAINT [FK_NGUYEN_NHAN_DUNG_MAY_DownTimeType] FOREIGN KEY ([DownTimeTypeID]) REFERENCES [dbo].[DownTimeType] ([ID_DownTime])
ALTER TABLE [dbo].[NGUYEN_NHAN_DUNG_MAY] ADD CONSTRAINT [FK_NGUYEN_NHAN_DUNG_MAY_StopType] FOREIGN KEY ([Planned]) REFERENCES [dbo].[StopType] ([ID])
END

IF NOT  EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES Where Table_Schema = 'dbo' AND Table_Name ='LOAI_MAY_NGUYEN_NHAN')
BEGIN
CREATE TABLE [dbo].[LOAI_MAY_NGUYEN_NHAN]
(
[MS_LOAI_MAY] [nvarchar] (20)  NOT NULL,
[MS_NGUYEN_NHAN] [int] NOT NULL
) ON [PRIMARY]
ALTER TABLE [dbo].[LOAI_MAY_NGUYEN_NHAN] ADD CONSTRAINT [PK_LOAI_MAY_NGUYEN_NHAN] PRIMARY KEY CLUSTERED ([MS_LOAI_MAY], [MS_NGUYEN_NHAN]) ON [PRIMARY]
ALTER TABLE [dbo].[LOAI_MAY_NGUYEN_NHAN] ADD CONSTRAINT [FK_LOAI_MAY_NGUYEN_NHAN_LOAI_MAY] FOREIGN KEY ([MS_LOAI_MAY]) REFERENCES [dbo].[LOAI_MAY] ([MS_LOAI_MAY])
ALTER TABLE [dbo].[LOAI_MAY_NGUYEN_NHAN] ADD CONSTRAINT [FK_LOAI_MAY_NGUYEN_NHAN_NGUYEN_NHAN_DUNG_MAY] FOREIGN KEY ([MS_NGUYEN_NHAN]) REFERENCES [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN])
END


IF NOT  EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES Where Table_Schema = 'dbo' AND Table_Name ='THOI_GIAN_DUNG_MAY')
BEGIN
CREATE TABLE [dbo].[THOI_GIAN_DUNG_MAY]
(
[ID] [bigint] NOT NULL IDENTITY(1, 1),
[MS_MAY] [nvarchar] (30)  NOT NULL,
[CaID] [int] NULL,
[NGAY_DUNG] [datetime] NULL,
[TU_GIO] [datetime] NOT NULL,
[TU_GIO_GOC] [datetime] NULL,
[DEN_GIO] [datetime] NOT NULL,
[DEN_GIO_GOC] [datetime] NULL,
[THOI_GIAN_SUA_CHUA] [float] NULL,
[THOI_GIAN_SUA] [float] NULL,
[MS_NGUYEN_NHAN] [int] NULL,
[MS_NGUYEN_NHAN_GOC] [int] NULL,
[USERNAME] [nvarchar] (30) NOT NULL,
[ID_CHA] [bigint] NULL,
[MS_HE_THONG] INT NULL,
[MS_PBT] NVARCHAR(20) NULL,
[CLOSED] BIT NULL,
[GHI_CHU] [nvarchar] (500)  NULL,
[UserEdit] [nvarchar] (30)  NULL,
[DateEdit] [datetime] NULL
) ON [PRIMARY]
ALTER TABLE [dbo].[THOI_GIAN_DUNG_MAY] ADD CONSTRAINT [PK_THOI_GIAN_DUNG_MAY] PRIMARY KEY CLUSTERED ([ID]) ON [PRIMARY]
ALTER TABLE [dbo].[THOI_GIAN_DUNG_MAY] ADD CONSTRAINT [FK_THOI_GIAN_DUNG_MAY_NGUYEN_NHAN_DUNG_MAY] FOREIGN KEY ([MS_NGUYEN_NHAN]) REFERENCES [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN])
END


--GO
--SET IDENTITY_INSERT [dbo].[DownTimeType] ON 
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (18, N'Bảo trì có kế hoạch', N'Planned Maintenance', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (19, N'Bảo trì tự quản', N'Autonomous Maintenance', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (20, N'Học & Họp', N'Training & Meeting', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (21, N'Chuyển đổi mặt hàng', N'Changeover', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (22, N'Khởi động máy', N'Warm up', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (23, N'Ăn giữa ca', N'Meal break', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (24, N'Không có đơn hàng', N'No production order', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (25, N'Dừng cuối tuần', N'Stop end of week', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (26, N'Cúp điện có kế hoạch', N'Planned power shutdown', N'', N'', 0, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (27, N'Chạy thử', N'Trial', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (28, N'Nguyên liệu có vấn đề', N'Material issue', N'', N'', 1, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (29, N'không có KH chạy máy', N'Idle', N'', N'', 0, 1, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (30, N'Sự cố dừng máy lớn', N'Machine breakdown', N'', N'', 1, 0, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (31, N'Dừng máy ngắn', N'Short stop', N'', N'', 0, 0, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (32, N'Sự cố đơn giản', N'Simple issue', N'', N'', 1, 0, 1, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (33, N'Cúp điện đột xuất', N'Unplanned power shutdown', N'', N'', 0, 0, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (34, N'Sự cố chất lượng', N'Quality issue', N'', N'', 1, 0, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (35, N'Sự cố vật liệu', N'Material issue', N'', N'', 1, 0, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (36, N'Khác', N'Other', N'', N'', 1, 0, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (37, N'Dừng máy dài', N'Long stop', NULL, NULL, 1, 0, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (38, N'Sự cố cung ứng', N'Logistic issue', NULL, NULL, 1, 0, NULL, NULL)
--GO
--INSERT [dbo].[DownTimeType] ([ID_DownTime], [DownTimeTypeName], [DownTimeTypeNameA], [DownTimeTypeNameH], [Note], [HMIType], [Planned], [NoEdit], [SORT]) VALUES (39, N'Set up máy', N'Set up', N'', N'', 1, 1, NULL, NULL)
--GO
--SET IDENTITY_INSERT [dbo].[DownTimeType] OFF
--GO
--SET IDENTITY_INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ON 
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (1, N'Bảo trì hàng tháng', 1, 1, N'Monthly', 0, 1, N'DT1', 18, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (2, N'Bảo trì hàng tuần', 1, 1, N'Weekly', 0, 1, N'DT2', 18, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (3, N'Bảo trì hàng quý', 1, 1, N'Quarterly', 0, 1, N'DT3', 18, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (4, N'Bảo trì nửa năm', 1, 1, N'Half-year', 0, 1, N'DT4', 18, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (5, N'Đại tu', 1, 1, N'Overhaul', 0, 1, N'DT5', 18, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (6, N'Bảo trì tự quản', 1, 1, N'Autonomous Maintenance', 0, 1, N'DT6', 19, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (7, N'5S', 1, 1, N'5S', 1, 1, N'DT7', 19, NULL, 1, CAST(0.00 AS Decimal(18, 2)), 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (8, N'Vệ sinh khuôn', 1, 1, N'Mold cleaning', 0, 1, N'DT8', 19, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (9, N'Đào tạo', 1, 1, N'Training', 1, 1, N'DT9', 20, NULL, 0, CAST(0.00 AS Decimal(18, 2)), 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (10, N'Họp', 1, 1, N'Meeting', 1, 1, N'DT10', 20, NULL, 0, CAST(0.00 AS Decimal(18, 2)), 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (11, N'Cùng màu cùng nhựa', 1, 1, N'Changeover', 1, 1, N'DT11', 21, NULL, 1, CAST(15.00 AS Decimal(18, 2)), 1)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (12, N'Khởi động máy', 1, 1, N'Warm up', 0, 1, N'DT12', 22, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (13, N'Nghỉ ăn cơm', 1, 1, N'Meal break', 0, 1, N'DT13', 23, NULL, 0, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (14, N'Không có đơn hàng', 1, 1, N'No production order', 1, 1, N'DT14', 24, NULL, 0, CAST(0.00 AS Decimal(18, 2)), 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (15, N'Cúp điện có kế hoạch', 1, 1, N'Planned power shutdown', 1, 1, N'DT15', 26, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (16, N'Thử khuôn', 1, 1, N'Trial', 1, 1, N'DT16', 27, NULL, 0, NULL, 0)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (17, N'Thiếu nguyên liệu', 1, 1, N'Material shortage', 0, 1, N'DT17', 28, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (18, N'Nguyên liệu chất lượng kém', 1, 1, N'Material quality issue', 0, 1, N'DT18', 28, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (19, N'Khác', 1, 1, N'Other', 0, 1, N'DT19', 29, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (21, N'Đang chờ trưởng ca', 1, 1, N'Waiting for Team leader', 0, 2, N'DT21', 31, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (22, N'Đang chờ người đứng máy', 1, 1, N'Waiting for Operator', 0, 2, N'DT22', 31, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (23, N'Đang chờ kỹ thuật viên', 1, 1, N'Waiting for DEPT', 0, 2, N'DT23', 31, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (24, N'Robot hút rớt sản phẩm', 1, 1, N'', 0, 2, N'DT24', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (25, N'Robot báo lỗi cảm biến xylanh', 1, 1, N'', 0, 2, N'DT25', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (26, N'Máy báo lỗi vị trí kết thúc bảo áp', 1, 1, N'', 0, 2, N'DT26', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (27, N'Máy báo lỗi đóng khuôn áp thấp', 1, 1, N'', 0, 2, N'DT27', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (28, N'Máy báo lỗi quá thời gian tuần hoàn', 1, 1, N'', 0, 2, N'DT28', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (29, N'Máy báo lỗi vị trí lối lùi', 1, 1, N'', 0, 2, N'DT29', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (30, N'Tét đường ống khí nén', 1, 1, N'', 0, 2, N'DT30', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (31, N'Tét đường ống nước của khuôn', 1, 1, N'', 0, 2, N'DT31', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (32, N'Nhựa hút lên hopper không được', 1, 1, N'', 0, 2, N'DT32', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (33, N'Hư relay', 1, 1, N'', 0, 2, N'DT33', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (34, N'Vệ sinh khuôn', 1, 1, N'', 0, 2, N'DT34', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (35, N'Sản phẩm bị thiếu nhựa', 1, 1, N'', 0, 2, N'DT35', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (36, N'Sản phẩm bị dư nhựa', 1, 1, N'', 0, 2, N'DT36', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (37, N'Sản phẩm bị lõm', 1, 1, N'', 0, 2, N'DT37', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (38, N'Sản phẩm bị cháy nhựa', 1, 1, N'', 0, 2, N'DT38', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (39, N'Sản phẩm bị bot nhựa', 1, 1, N'', 0, 2, N'DT39', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (40, N'Sản phẩm bị cổng nhựa cao', 1, 1, N'', 0, 2, N'DT40', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (41, N'Sản phẩm bị biến dạng', 1, 1, N'', 0, 2, N'DT41', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (42, N'Sản phẩm bị weldline', 1, 1, N'', 0, 2, N'DT42', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (43, N'Sản phẩm bị trắng vị trí lối', 1, 1, N'', 0, 2, N'DT43', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (44, N'Sản phẩm bị tơ nhựa', 1, 1, N'', 0, 2, N'DT44', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (45, N'Sản phẩm bị loang màu', 1, 1, N'', 0, 2, N'DT45', 32, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (46, N'Cúp điện đột xuất', 1, 1, N'Unplanned power shutdown', 1, 2, N'DT46', 33, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (47, N'Lỗi Bavia nhựa', 1, 1, N'', 0, 2, N'DT47', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (48, N'phù nhựa', 1, 1, N'', 0, 2, N'DT48', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (49, N'Lõm', 1, 1, N'', 0, 2, N'DT49', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (50, N'Sai chức năng', 1, 1, N'', 0, 2, N'DT50', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (51, N'Sai lỗ pin', 1, 1, N'', 0, 2, N'DT51', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (52, N'kích thước không đạt', 1, 1, N'', 0, 2, N'DT52', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (53, N'Dính dầu ảnh hưởng đển ngoại quan khi sơn', 1, 1, N'', 0, 2, N'DT53', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (54, N'Màu sắc không đúng chuẩn', 1, 1, N'', 0, 2, N'DT54', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (55, N'Trầy xước nhựa', 1, 1, N'', 0, 2, N'DT55', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (56, N'Thiếu nhựa', 1, 1, N'', 0, 2, N'DT56', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (57, N'bọt nhựa', 1, 1, N'', 0, 2, N'DT57', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (58, N'gãy nhựa', 1, 1, N'', 0, 2, N'DT58', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (59, N'tơ nhựa', 1, 1, N'', 0, 2, N'DT59', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (60, N'Biến dạng nhựa', 1, 1, N'', 0, 2, N'DT60', 34, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (61, N'Khác', 1, 1, N'Other', 0, 2, N'DT61', 36, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (62, N'Tổ trưởng không giải quyết được', 1, 1, N'', 0, 2, N'DT62', 31, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (63, N'Bể ống khí của robot
--', 1, 1, N'', 0, 2, N'DT63', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (64, N'Robot hút hoặc kẹp sản phẩm không được', 1, 1, N'', 0, 2, N'DT64', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (65, N'Xút phần bít cổng nhựa của cavity', 1, 1, N'', 1, 2, N'DT65', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (66, N'Đứt đuôi sprue', 1, 1, N'', 1, 2, N'DT66', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (67, N'Nghẹt kim loại ở trong nozzle', 1, 1, N'', 1, 2, N'DT67', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (68, N'Sản phẩm dính ngược', 1, 1, N'', 1, 2, N'DT68', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (69, N'Lỗi sensor robot', 1, 1, N'', 0, 2, N'DT69', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (70, N'Quạt hút hơi nóng trong tủ điện bị hư', 1, 1, N'', 1, 2, N'DT70', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (71, N'Máy không hút nhựa lên hopper', 1, 1, N'', 1, 2, N'DT71', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (72, N'Máy nước khuôn bị hư', 1, 1, N'', 1, 2, N'DT72', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (73, N'Khuôn kẹt lối', 1, 1, N'', 1, 2, N'DT73', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (74, N'Bộ trộn màu bị hư', 1, 1, N'', 1, 2, N'DT74', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (75, N'Hư công tắc hành trình của khuôn', 1, 1, N'', 1, 2, N'DT75', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (76, N'Khuôn bị gãy pin', 1, 1, N'', 1, 2, N'DT76', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (77, N'Khuôn bị gãy lifter', 1, 1, N'', 1, 2, N'DT77', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (78, N'Máy bị hư vòng nhiệt', 1, 1, N'', 1, 2, N'DT78', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (79, N'Xì nhựa đầu phun', 1, 1, N'', 1, 2, N'DT79', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (80, N'Nghẹt nhựa cổ hopper', 1, 1, N'', 1, 2, N'DT80', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (81, N'Vệ sinh solenoi valve', 1, 1, N'', 1, 2, N'DT81', 37, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (82, N'Sự cố dừng máy lớn', 1, 1, N'', 1, 2, N'DT82', 30, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (83, N'Sự cố vật liệu', 1, 1, N'Material issue', 1, 2, N'DT83', 35, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (84, N'Sự cố cung ứng', 1, 1, N'Logistic issue', 1, 2, N'DT84', 38, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (85, N'Dừng cuối tuần', 1, 1, N'Stop end of week', 1, 1, N'DT85', 25, NULL, 1, NULL, 5)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (86, N'Từ natural sang màu khác , cùng nhựa', 1, 1, N'Changeover', 1, 1, N'DT86', 21, NULL, 1, CAST(20.00 AS Decimal(18, 2)), 1)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (87, N'Từ màu khác sang màu đen, cùng nhựa', 1, 1, N'Changeover', 1, 1, N'DT87', 21, NULL, 1, CAST(20.00 AS Decimal(18, 2)), 1)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (88, N'Từ màu đen sang màu khác, cùng nhựa', 1, 1, N'Changeover', 0, 1, N'DT88', 21, NULL, 1, CAST(30.00 AS Decimal(18, 2)), 1)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (89, N'Khác màu, khác nhựa', 1, 1, N'Changeover', 0, 1, N'DT89', 21, NULL, 1, CAST(35.00 AS Decimal(18, 2)), 1)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (90, N'Không thay khuôn, đổi từ màu natural sang màu khác', 1, 1, N'Changeover', 0, 1, N'DT90', 21, NULL, 1, CAST(10.00 AS Decimal(18, 2)), 1)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (91, N'Không thay khuôn, đổi từ màu khác sang natural', 1, 1, N'Changeover', 0, 1, N'DT91', 21, NULL, 1, CAST(15.00 AS Decimal(18, 2)), 1)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (92, N'Không thay khuôn, chỉ thay insert', 1, 1, N'Changeover', 0, 1, N'DT92', 21, NULL, 1, CAST(8.00 AS Decimal(18, 2)), 1)
--GO
--INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] ([MS_NGUYEN_NHAN], [TEN_NGUYEN_NHAN], [HU_HONG], [BTDK], [TEN_NGUYEN_NHAN_ANH], [MAC_DINH], [Planned], [CauseCode], [DownTimeTypeID], [SORT], [OEE], [DefineLevel], [AUTO_CYCLE]) VALUES (93, N'Set up', 1, 1, N'', 0, 2, N'Set up máy', 39, NULL, 1, CAST(0.00 AS Decimal(18, 2)), 1)
--GO
--SET IDENTITY_INSERT [dbo].[NGUYEN_NHAN_DUNG_MAY] OFF
--GO
