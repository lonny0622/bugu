package com.living.activity.service;

import com.aliyuncs.exceptions.ClientException;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.gson.Gson;
import com.living.activity.domain.dto.ActivityCommentResultWithCommentResponseResult;
import com.living.core.config.HotConfig;
import com.living.activity.decorate.ActivityLabelDecorate;
import com.living.activity.domain.dao.Activity;
import com.living.activity.domain.dao.Comment;
import com.living.activity.domain.dao.CommentResponse;
import com.living.activity.domain.dao.Label;
import com.living.activity.domain.dto.ActivityComment;
import com.living.activity.domain.dto.SquareActivity;
import com.living.core.domain.helper.CommentUser;
import com.living.activity.domain.result.*;
import com.living.activity.exception.ActivityCommentNotExist;
import com.living.activity.exception.ActivityNotExistException;
import com.living.activity.mapper.ActivityDao;
import com.living.activity.mapper.CommentDao;
import com.living.activity.mapper.LabelDao;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.dao.User;
import com.living.core.domain.result.PageResult;
import com.living.core.exception.*;
import com.living.core.result.ApiResult;
import com.living.core.service.UserService;
import com.living.core.util.UserUtil;
import com.living.core.service.InteractiveMessageService;
import com.living.question.dto.AnswerCommentDto;
import com.qiniu.common.QiniuException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author lizijian
 */
@Service
@Slf4j
public class ActivityService {

  @Autowired
  private ActivityDao activityDao;

  @Autowired
  private CommentDao commentDao;

  @Autowired
  private InteractiveMessageService interactiveMessageService;

  @Autowired
  private ActivityMessageService activityMessageService;
  @Autowired
  private LabelDao labelDao;


  @Autowired
  private Gson gson;

  @Autowired
  private ActivityLabelDecorate activityLabelDecorate;

  @Autowired
  private PicCheckService picCheckService;
  @Autowired
  private TextCheckService textCheckService;

  @Autowired VideoCheckService videoCheckService;
  @Autowired
  private UserService userService;

  @Transactional(rollbackFor = Exception.class)
  public void publish(String text, String pic, short isAnonymity, short visibility, String labelIds,short video)
      throws ParamErrorException, WeiXinException, IOException, ClientException, NoPermissionException {
    User my = UserUtil.getUser();
    //????????????????????????vip????????????????????????????????????
    if(video==1){
      userService.checkVip(my.getId());
      userService.checkVerify(my.getId());
    }
    Activity activity = Activity.publish(text, pic, my.getId(), isAnonymity, visibility,video);
    activityDao.publish(activity);
    if (labelIds != null) {
      int[] ids = gson.fromJson(labelIds, int[].class);
      if (ids != null) {
        if (ids.length > 5) {
          throw new ParamErrorException("???????????????");
        }
        labelDao.addActivityLabels(ids, activity.getId());
        labelDao.addLabelsHot(5,ids);
      }
    }
    /**
     * ????????????????????????,??????????????????????????????
     * ?????????????????????????????????
     */
    if(isAnonymity==0&&visibility!=2){
      interactiveMessageService.publish(my,activity.getId());
    }
    /**
     * ????????????????????????
     */
    if(text!=null){
      textCheckService.checkActivityText(text,activity.getId(),my.getId(),my.getOpenid());
    }
    /**
     * ????????????????????????/??????
     */
    if(pic!=null){
      if(video==1){
        videoCheckService.checkVideo(gson.fromJson(pic,String[].class),activity.getId(),my.getId());
      }else {
        picCheckService.checkActivityPic(gson.fromJson(pic,String[].class),activity.getId(),my.getId());
      }
    }

  }

  public void delete(Integer id)
      throws ResourseNotExistException, NoPermissionException, QiniuException {
    Activity activity = activityDao.getActivityById(id);
    if (activity == null) {
      throw new ResourseNotExistException("???????????????");
    }
    if (activity.getUserId() != UserUtil.getUserId()) {
      throw new NoPermissionException("????????????");
    }
    activityDao.delete(id);
  }

  @Transactional(rollbackFor = Exception.class)
  public void like(int id) throws Exception {
    User my = UserUtil.getUser();
    try {
      activityDao.addLikeSum(id,HotConfig.LIKE);
      activityDao.like(my.getId(), id);
    } catch (DuplicateKeyException e) {
      log.error(my.getId() + "?????????????????????-" + id);
      throw new ActionErrorException("?????????????????????");
    }
    /**
     * ???????????????????????????,????????????????????????????????????
     */
    activityMessageService.like(my,id);
  }

  @Transactional(rollbackFor = Exception.class)
  public void removeLike(int id) {
    int i = activityDao.removeLike(UserUtil.getUserId(), id);
    if (i > 0) {
      activityDao.reduceLikeSum(id,HotConfig.LIKE);
    }
  }

  public PageResult<List<ActivityResult>> activity(int userId, int page) throws ResourseNotExistException {
    List<Activity> activity = null;
    PageHelper.startPage(page,5);
    if (userId == UserUtil.getUserId()) {
      activity = activityDao.getMyActivity(userId);
    }else {
      activity=activityDao.getUserActivity(userId,UserUtil.getUserId());
    }
    PageInfo<Activity> pageInfo = new PageInfo<>(activity);
    List<ActivityResult> activityResults = activity.stream().map(ActivityResult::new)
        .collect(
            Collectors.toList());
    /**
     * ????????????????????????0????????????????????????
     */
    if(activityResults.size()>0){
      activityLabelDecorate.decorate(activityResults);
    }
    return new PageResult<>(pageInfo,activityResults);
  }

  //TODO:123
  public PageResult<List<SquareActivityResult>> getSquareActivity(int page) {
    int userId = UserUtil.getUserId();
    //??????????????????,?????????????????????????????????
    if (page == 1) {
      Integer[] squareActivity = activityDao.getSquareActivity(userId);
      if (squareActivity.length > 0) {
        //??????id????????????
        Arrays.sort(squareActivity);
        activityDao.viewActivity(squareActivity, userId);
        activityDao.updateActivityViews(squareActivity);
      }
    }

    PageHelper.startPage(page, 5);
    List<SquareActivity> squareActivityHistory = activityDao.getSquareActivityHistory(userId);

    PageInfo<SquareActivity> pageInfo = new PageInfo<>(squareActivityHistory);
    List<SquareActivityResult> squareActivityResults = squareActivityHistory.stream()
        //???????????????????????????????????????????????????
        .filter(a->a.getIsDeleted()==0&&a.getVisibility()==0)
        .map(SquareActivityResult::new)
        .collect(Collectors.toList());
    if(squareActivityResults.size()>0){
      activityLabelDecorate.decorate(squareActivityResults);
    }

    return new PageResult<>(pageInfo,squareActivityResults);
  }

  public PageResult<List<SquareActivityResult>> hotActivity(int page){
    PageHelper.startPage(page, 10);
    List<SquareActivity> hotActivity = activityDao.getHotActivity(UserUtil.getUserId());
    PageInfo<SquareActivity> pageInfo = new PageInfo<>(hotActivity);
    List<SquareActivityResult> squareActivityResults = hotActivity.stream().map(SquareActivityResult::new)
        .collect(Collectors.toList());
    if(squareActivityResults.size()>0){
      activityLabelDecorate.decorate(squareActivityResults);
    }
    return new PageResult<>(pageInfo,squareActivityResults);
  }

  public SquareActivityResult activityInfo(int id) throws ResourseNotExistException {
    SquareActivity activity = activityDao.getActivityInfoById(id, UserUtil.getUserId());
    if (activity == null) {
      throw new ResourseNotExistException("???????????????");
    }
    if (activity.getIsDeleted() == 1) {
      throw new ResourseNotExistException("???????????????");
    }
    SquareActivityResult squareActivityResult = new SquareActivityResult(activity);
    List<Label> labels = labelDao.getLabelsByActivityId(squareActivityResult.getId());
    squareActivityResult.setLabels(labels);
    return squareActivityResult;
  }

  public PageResult<List<SquareActivityResult>> attentionActivity(int page) {
    PageHelper.startPage(page, 5);
    List<SquareActivity> attentionActivity = activityDao.getAttentionActivity(UserUtil.getUserId());
    PageInfo<SquareActivity> pageInfo = new PageInfo<>(attentionActivity);
    List<SquareActivityResult> squareActivityResults = attentionActivity.stream().map(SquareActivityResult::new)
        .collect(
            Collectors.toList());
    if(squareActivityResults.size()>0){
      activityLabelDecorate.decorate(squareActivityResults);
    }
    return new PageResult<>(pageInfo,squareActivityResults);
  }

  public Integer comment(Integer activityId, String content, Short type)
      throws ActivityNotExistException, WeiXinException, IOException {
    User my = UserUtil.getUser();
    SquareActivity activity = activityDao.getActivityInfoById(activityId, my.getId());
    if (activity == null) {
      throw new ActivityNotExistException();
    }

    Comment comment = Comment.create(my.getId(), activityId, content, type);

    if (commentDao.addComment(comment) > 0) {
      //???????????????????????????
      activityDao.addCommentSum(activityId, HotConfig.COMMENT);
      //???????????????????????????,??????????????????????????????
      if (activity.getPublisher().getId() != my.getId()) {
        interactiveMessageService.comment(my,activityId,activity.getPublisher().getId());
      }
      /**
       * ?????????????????????,??????????????????
       */
      if(type==(short)0){
        textCheckService.checkCommentText(content,comment.getId(),my.getId(),my.getOpenid());
      }
    }

    return comment.getId();
  }

  public PageResult<List<ActivityCommentResultWithCommentResponseResult>> getCommentList(int activityId, int startPage, int pageSize,int son_startPage,int son_pageSize)
          throws ActivityNotExistException, ActivityCommentNotExist {
    Activity activity = activityDao.getActivityById(activityId);
    if(activity==null){
      throw new ActivityNotExistException();
    }
    PageHelper.startPage(startPage,pageSize);
    List<ActivityComment> comment = commentDao.getCommentByActivityId(activityId,
        UserUtil.getUserId());
    //?????????????????????,???????????????????????????,??????????????????????????????
    if(activity.getIsAnonymity()==1){
      for (ActivityComment activityComment : comment) {
        if(activityComment.getPublisher().getId()==activity.getUserId()){
          CommentUser commentUser = activityComment.getPublisher();
          commentUser.setId(0);
          commentUser.setUsername("???????????????");
          commentUser.setAvatar(QiNiuConfig.ANONYMOUS_AVATAR);
        }
      }
    }
    PageInfo<ActivityComment> pageInfo = new PageInfo<>(comment);
    List<ActivityCommentResultWithCommentResponseResult> res=new ArrayList<>();
    List<ActivityCommentResult> commentList = comment.stream().map(ActivityCommentResult::new).collect(Collectors.toList());
    //????????????????????????
    for (ActivityCommentResult father : commentList) {
      //????????????????????????????????????????????????
      List<CommentResponseResult> sonResults = commentResponseList(father.getId(), son_startPage, son_pageSize);
      ActivityCommentResultWithCommentResponseResult build = ActivityCommentResultWithCommentResponseResult.builder().father(father).sons(sonResults).build();
      res.add(build);
    }
    return new PageResult<>(pageInfo,res);
  }

  @Transactional(rollbackFor = Exception.class)
  public void likeComment(int commentId) throws ActionErrorException {
    int i = commentDao.addLikeSum(commentId);
    if (i > 0) {
      try {
        commentDao.likeComment(UserUtil.getUserId(), commentId);
      } catch (DuplicateKeyException e) {
        log.error(UserUtil.getUserId() + "-????????????");
        throw new ActionErrorException("?????????????????????");
      }
    }
  }

  @Transactional(rollbackFor = Exception.class)
  public void removeLikeComment(int commentId){
    int i = commentDao.removeLikeComment(UserUtil.getUserId(), commentId);
    if(i>0){
      commentDao.subLikeSum(commentId);
    }
  }

  public void deleteComment(int id) throws ResourseNotExistException, NoPermissionException {
    ActivityComment comment = commentDao.getCommentById(id);
    if (comment == null) {
      throw new ResourseNotExistException("???????????????");
    }
    Activity activity = activityDao.getActivityById(comment.getActivityId());
    if(activity==null){
      throw new ResourseNotExistException("???????????????");
    }
    //???????????????????????????????????????????????????
    if (comment.getPublisher().getId() != UserUtil.getUserId()&&activity.getUserId()!=UserUtil.getUserId()) {
      throw new NoPermissionException("??????????????????");
    }
    if (comment.getIsDeleted() == 1) {
      throw new ResourseNotExistException("???????????????");
    }
    commentDao.deleteComment(id);
  }

  public void deleteCommentResponse(int id) throws ResourseNotExistException, NoPermissionException {
    CommentResponse commentResponse = commentDao.getCommentResponseById(id);
    if(commentResponse==null){
      throw new ResourseNotExistException("?????????????????????");
    }
    ActivityComment activityComment = commentDao.getCommentById(commentResponse.getActivityCommentId());
    if(activityComment==null){
      throw new ResourseNotExistException("?????????????????????");
    }
    //?????????????????????????????????,??????????????????????????????
    if(commentResponse.getFromUserId()!=UserUtil.getUserId()&&activityComment.getPublisher().getId()!=UserUtil.getUserId()){
      throw new NoPermissionException("??????????????????");
    }
    commentDao.deleteCommentResponse(id);
  }


  @Transactional(rollbackFor = Exception.class)
  public Integer commentResponse(int commentId, String content, short type, int toUserId)
      throws ResourseNotExistException, WeiXinException, IOException {
    User my = UserUtil.getUser();

    ActivityComment comment = commentDao.getCommentById(commentId);
    if (comment == null) {
      throw new ResourseNotExistException("???????????????");
    }

    CommentResponse commentResponse = CommentResponse.create(commentId, my.getId(),
        toUserId, content, type);

    commentDao.commentResponse(commentResponse);
    Integer remarkId=commentResponse.getId();
    //????????????????????????
    commentDao.addResponseSum(commentId);
    //????????????????????????
    activityDao.addCommentSum(comment.getActivityId(), HotConfig.COMMENT);

    /**
     * ?????????????????????,??????????????????
     */
    if(type==0){
      textCheckService.checkCommentResponseText(content,commentResponse.getId(),my.getId(),my.getOpenid());
    }

      return remarkId;
  }

  public List<CommentResponseResult> commentResponseList(int commentId, Integer startPage, Integer pageSize)
      throws ActivityCommentNotExist, ActivityNotExistException {
    //??????????????????????????????
    ActivityComment activityComment = commentDao.getCommentById(commentId);
    if(activityComment==null){
      throw new ActivityCommentNotExist();
    }
    //???????????????
    Activity activity = activityDao.getActivityById(activityComment.getActivityId());
    if(activity==null){
      throw new ActivityNotExistException();
    }

    PageHelper.startPage(startPage,pageSize);
    List<com.living.activity.domain.dto.CommentResponse> commentResponses = commentDao.commentResponseList(
        commentId);

    if(activity.getIsAnonymity()==1){
      for (com.living.activity.domain.dto.CommentResponse commentResponseResult : commentResponses) {
        if(commentResponseResult.getFromUserId()==activity.getUserId()){
          commentResponseResult.setFromUserId(0);
          commentResponseResult.setFromUsername(QiNiuConfig.ANONYMOUS_USERNAME);
          commentResponseResult.setFromUserAvatar(QiNiuConfig.ANONYMOUS_AVATAR);
        }
      }
    }
    return commentResponses.stream().map(CommentResponseResult::new).collect(Collectors.toList());
  }

  public PageResult<List<Label>> labelList(int page) {
    PageHelper.startPage(page, 10);
    List<Label> labelList = labelDao.getLabelList();
    PageInfo<Label> pageInfo = new PageInfo<>(labelList);
    return new PageResult<>(pageInfo, labelList);
  }

  public Integer addLabel(String content) {
    Label label = new Label();
    label.setContent(content);
    try {
      labelDao.addLabel(label);
      return label.getId();
    } catch (DuplicateKeyException e) {
      return labelDao.getLabelByContent(content).getId();
    }
  }

  public List<Label> fuzzyQueryLabel(String content) {
    StringBuilder finalContent = new StringBuilder();
    for (int i = 0; i < content.length(); i++) {
      finalContent.append(content.charAt(i));
      finalContent.append("%");
    }
    return labelDao.fuzzyQueryLabel(finalContent.toString());
  }

  public void changeVisibility(int activityId,short visibility)
      throws ResourseNotExistException, NoPermissionException, ParamErrorException {
    if(visibility<0||visibility>2){
      throw new ParamErrorException("visibility????????????");
    }
    Activity activity = activityDao.getActivityById(activityId);
    if(activity==null){
      throw new ResourseNotExistException("???????????????");
    }
    if(activity.getUserId()!=UserUtil.getUserId()){
      throw new NoPermissionException("????????????");
    }
    activityDao.changeVisibility(activityId,visibility);
  }

  public PageResult<List<SquareActivityResult>> groupByLabel(int labelId,int page){
    PageHelper.startPage(page,5);
    List<SquareActivity> activities = activityDao.findByLabel(labelId,UserUtil.getUserId());
    PageInfo<SquareActivity> pageInfo = new PageInfo<>(activities);
    List<SquareActivityResult> squareActivityResults = activities.stream().map(SquareActivityResult::new)
        .collect(Collectors.toList());
    activityLabelDecorate.decorate(squareActivityResults);
    labelDao.addLabelHot(1,labelId);
    return new PageResult<>(pageInfo,squareActivityResults);
  }


  public PageResult<List<SquareActivityResult>> fullTextQuery(String subText,int page) throws ParamErrorException {
    if(subText.length()<2){
      throw new ParamErrorException("subText????????????");
    }
    PageHelper.startPage(page,5);
    List<SquareActivity> squareActivities = activityDao.getFullTextQueryId(subText,UserUtil.getUserId());
    List<SquareActivityResult> squareActivityResults = squareActivities.stream().map(SquareActivityResult::new)
        .collect(
            Collectors.toList());
    if(squareActivityResults.size()>0){
      activityLabelDecorate.decorate(squareActivityResults);
    }
    return new PageResult<>(new PageInfo<>(squareActivities),squareActivityResults);
  }

  /**
   * <p>
   *     ??????????????????????????????
   * </p>
   * @param uid
   * @param startPage
   * @param pageSize
   * @return
   */
  //TODO:1234
  public List<SquareActivityResult> getUserLikeActivity(Integer uid, Integer startPage,Integer pageSize) {
    PageHelper.startPage(startPage, pageSize);
    List<SquareActivity> userLikeActivity = activityDao.getUserLikeActivity(uid);
    List<SquareActivityResult> squareActivityResults = userLikeActivity.stream()
            //???????????????????????????????????????????????????
            .filter(a->a.getIsDeleted()==0&&a.getVisibility()==0)
            .map(SquareActivityResult::new)
            .collect(Collectors.toList());
    if(squareActivityResults.size()>0){
      activityLabelDecorate.decorate(squareActivityResults);
    }

    return squareActivityResults;
  }

  /**
   * ???????????????????????????
   */
  public ApiResult<List<RecommendedLabelResult>> getRecommendedLabelList() {
    List<Label> labelList = labelDao.getRecommendedLabelList();
    List<RecommendedLabelResult> recommendedLabelResults = labelList.stream().
            map(RecommendedLabelResult::new).collect(Collectors.toList());
    return ApiResult.success(recommendedLabelResults);
  }
}
