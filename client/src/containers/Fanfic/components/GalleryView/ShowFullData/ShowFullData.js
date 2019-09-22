import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import UserData from '../../ShowFanficData/UserData/UserData';
import FanficData from '../../ShowFanficData/FanficData/FanficData';
import './ShowFullData.scss'

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function ShowFullData(props) {

  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const {userFanfics,showTagsToggle,showTags,readingLists,filter,switches,images} = props.props;
  const {isManager,isAuthenticated,size} = props.props.props
  const {getCategories,saveCategories,showSelectCategory,inputCategoryFlag,categoriesTemp,showCategory} = props.props.categories;
  const tagSwitch=switches[1].checked,showImagesSwitch=switches[2].checked,showMnagerButtonsSwitch=switches[4].checked;
  const fanfic = props.fanfic;
  return (
    <div>
      <Dialog  className='dialog'  onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogContent dividers>
            <Card className='card'  key={fanfic.FanficID}>
                <div className={showImagesSwitch?'detailsWithImage':'detailsWithoutImage'}>
                    <CardContent className='card_content'>
                        
                        <FanficData         fanfic={fanfic} size={size} showTagsToggle={showTagsToggle} showTags={showTags} filter={filter}
                                            getCategories={getCategories} saveCategories={saveCategories} showSelectCategory={showSelectCategory} 
                                            inputCategoryFlag={inputCategoryFlag} categoriesTemp={categoriesTemp} tagSwitch={tagSwitch}/>                           
                        { isAuthenticated &&
                            <section className='card_content_userData'>
                                <UserData   props={props} 
                                            userFanfics={userFanfics} 
                                            fanfic={fanfic}
                                            isManager={isManager}
                                            showCategory={showCategory}
                                            showSelectCategory={showSelectCategory}
                                            readingLists={readingLists}
                                            showMnagerButtonsSwitch={showMnagerButtonsSwitch}
                                            images={images}
                                />
                            </section>
                        }
                    </CardContent>
                </div>
            </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}