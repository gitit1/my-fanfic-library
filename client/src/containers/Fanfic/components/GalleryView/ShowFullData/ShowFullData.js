import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FanficData from '../../ShowFanficData/FanficData/FanficData';
import './ShowFullData.scss'

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);


export default function ShowFullData(props) {

  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const {showTagsToggle,showTags,filter,switches} = props.props;
  const {size} = props.props.props
  const {getCategories,saveCategories,showSelectCategory,inputCategoryFlag,categoriesTemp} = props.props.categories;
  const tagSwitch=switches[1].checked,showImagesSwitch=switches[2].checked;
  const fanfic = props.fanfic;
  return (
    <div>
      <Dialog  className='dialog'  onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <IconButton aria-label="close"  className='close-button' onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
            <Card className='card'  key={fanfic.FanficID}>
                <div className={showImagesSwitch?'detailsWithImage':'detailsWithoutImage'}>
                    <CardContent className='card_content'>
                        <FanficData         fanfic={fanfic} size={size} showTagsToggle={showTagsToggle} showTags={showTags} filter={filter}
                                            getCategories={getCategories} saveCategories={saveCategories} showSelectCategory={showSelectCategory} 
                                            inputCategoryFlag={inputCategoryFlag} categoriesTemp={categoriesTemp} tagSwitch={tagSwitch}/>                           
                        {/* { isAuthenticated &&
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
                        } */}
                    </CardContent>
                </div>
            </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}