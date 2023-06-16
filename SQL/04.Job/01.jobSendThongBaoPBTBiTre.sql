

/****** Object:  Job [SendThongBaoPBTBiTre]    Script Date: 09/05/2023 16:36:50 ******/
BEGIN TRANSACTION
DECLARE @ReturnCode INT
SELECT @ReturnCode = 0
/****** Object:  JobCategory [[Uncategorized (Local)]]    Script Date: 09/05/2023 16:36:50 ******/
IF NOT EXISTS (SELECT name FROM msdb.dbo.syscategories WHERE name=N'[Uncategorized (Local)]' AND category_class=1)
BEGIN
EXEC @ReturnCode = msdb.dbo.sp_add_category @class=N'JOB', @type=N'LOCAL', @name=N'[Uncategorized (Local)]'
IF (@@ERROR <> 0 OR @ReturnCode <> 0) GOTO QuitWithRollback
END

DECLARE @jobId BINARY(16)
EXEC @ReturnCode =  msdb.dbo.sp_add_job @job_name=N'SendThongBaoPBTBiTre', 
		@enabled=1, 
		@notify_level_eventlog=0, 
		@notify_level_email=0, 
		@notify_level_netsend=0, 
		@notify_level_page=0, 
		@delete_level=0, 
		@description=N'No description available.', 
		@category_name=N'[Uncategorized (Local)]', 
		@owner_login_name=N'sa', @job_id = @jobId OUTPUT
IF (@@ERROR <> 0 OR @ReturnCode <> 0) GOTO QuitWithRollback
/****** Object:  Step [SendPBTTre]    Script Date: 09/05/2023 16:36:51 ******/
EXEC @ReturnCode = msdb.dbo.sp_add_jobstep @job_id=@jobId, @step_name=N'SendPBTTre', 
		@step_id=1, 
		@cmdexec_success_code=0, 
		@on_success_action=1, 
		@on_success_step_id=0, 
		@on_fail_action=2, 
		@on_fail_step_id=0, 
		@retry_attempts=0, 
		@retry_interval=0, 
		@os_run_priority=0, @subsystem=N'TSQL', 
		@command=N'SELECT ROW_NUMBER() OVER(ORDER BY B.MS_PHIEU_BAO_TRI) ID,B.MS_MAY,B.MS_PHIEU_BAO_TRI,SUM(D.TG_KH) AS KH,DATEDIFF(MINUTE,B.NGAY_LAP,GETDATE()) AS TT 
INTO #TMP
FROM dbo.YEU_CAU_NSD_CHI_TIET A
INNER JOIN dbo.PHIEU_BAO_TRI B ON A.MS_PBT = B.MS_PHIEU_BAO_TRI
INNER JOIN dbo.PHIEU_BAO_TRI_CONG_VIEC C ON C.MS_PHIEU_BAO_TRI = B.MS_PHIEU_BAO_TRI
INNER JOIN  dbo.CAU_TRUC_THIET_BI_CONG_VIEC D ON D.MS_MAY = A.MS_MAY AND D.MS_BO_PHAN = C.MS_BO_PHAN AND D.MS_CV = C.MS_CV
WHERE ISNULL(A.NGAY_XAY_RA,'''') !='''' AND B.TINH_TRANG_PBT = 2
GROUP BY B.MS_MAY,B.MS_PHIEU_BAO_TRI,B.NGAY_LAP
HAVING DATEDIFF(MINUTE,B.NGAY_LAP,GETDATE()) > 3 * (SUM(D.TG_KH)) 

DECLARE @rownum INT = 1, @totalrows INT;
DECLARE @total_minutes INT = 135;
DECLARE @sCot1 NVARCHAR(50) ='''',@sCot2 NVARCHAR(50) ='''',@sCot3 NVARCHAR(50) =''''
SELECT @totalrows = COUNT(*) FROM #TMP
WHILE @rownum <= @totalrows
BEGIN
--spcmmsweb
SET		@sCot1 = (SELECT MS_PHIEU_BAO_TRI FROM #TMP WHERE ID = @rownum);
SET		@sCot2 = (SELECT MS_MAY FROM #TMP WHERE ID = @rownum);
SET		@total_minutes = (SELECT TT-KH  FROM #TMP WHERE ID = @rownum);
SET @sCot3 =(SELECT CONCAT(@total_minutes / 60, ''h '', @total_minutes % 60, ''min'') )
	EXEC dbo.spSentThongBao @ID = 0,          -- bigint
	@UName = N'''',     -- nvarchar(50)
	@TableName = N''PHIEU_BAO_TRI_QUA_HAN_HOAN_THANH'', -- nvarchar(50)
	@sCot1 = @sCot1,     -- nvarchar(50)
	@sCot2 =@sCot2,     -- nvarchar(50)
	@sCot3 = @sCot3      -- nvarchar(50)
	SET @rownum = @rownum + 1
END
DROP TABLE #TMP', 
		@database_name=N'CMMS_DEV', 
		@flags=0
IF (@@ERROR <> 0 OR @ReturnCode <> 0) GOTO QuitWithRollback
EXEC @ReturnCode = msdb.dbo.sp_update_job @job_id = @jobId, @start_step_id = 1
IF (@@ERROR <> 0 OR @ReturnCode <> 0) GOTO QuitWithRollback
EXEC @ReturnCode = msdb.dbo.sp_add_jobschedule @job_id=@jobId, @name=N'SendBaoTriTre', 
		@enabled=1, 
		@freq_type=4, 
		@freq_interval=1, 
		@freq_subday_type=8, 
		@freq_subday_interval=3, 
		@freq_relative_interval=0, 
		@freq_recurrence_factor=0, 
		@active_start_date=20230509, 
		@active_end_date=99991231, 
		@active_start_time=50000, 
		@active_end_time=185959, 
		@schedule_uid=N'5b021d2f-77a5-490d-9ad3-32d533a7fbf3'
IF (@@ERROR <> 0 OR @ReturnCode <> 0) GOTO QuitWithRollback
EXEC @ReturnCode = msdb.dbo.sp_add_jobserver @job_id = @jobId, @server_name = N'(local)'
IF (@@ERROR <> 0 OR @ReturnCode <> 0) GOTO QuitWithRollback
COMMIT TRANSACTION
GOTO EndSave
QuitWithRollback:
    IF (@@TRANCOUNT > 0) ROLLBACK TRANSACTION
EndSave:
GO


