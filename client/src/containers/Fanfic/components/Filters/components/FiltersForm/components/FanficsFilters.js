import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { categories } from '../../../../../components/ShowFanficData/FanficData/Categories/assets/categoriesList';
import SelectCategories from '../../../../../../../components/UI/Input/SelectAutoComplete'


const FanficsFilters = ({ classes, filtersArray, checked, filter, getCategories, filteredCategories, isManager }) => {
    const [flag, setAnchorEl] = React.useState(false, null);

    function toggleFanficsFilters(e) {
        e.preventDefault();
        setAnchorEl(!flag);
    }

    return (
        <React.Fragment>
            <FormControl className={classes.FormControl} component="fieldset">
                <FormLabel focused={false} className={classes.FiltersFanficLabel} onClick={toggleFanficsFilters}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="material-icons">{flag ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}</i>
                        Fanfic Status Filters:
                    </span>
                </FormLabel>
                {flag &&
                    <React.Fragment>
                        {filtersArray.Fanfic.map(checkbox => {
                            const showCmd = (checkbox.manager && isManager) || !checkbox.manager;
                            return (
                                showCmd &&
                                <FormControlLabel key={checkbox.name}
                                    label={checkbox.display}
                                    className={classes.FiltersFanficCheckBox}
                                    control={<Checkbox value={checkbox.name}
                                        onChange={() => filter(`${checkbox.name}`, null, 'filter')}
                                        checked={checked[`${checkbox.name}`]}
                                        style={{ color: 'black' }}
                                    />}
                                />

                            )


                        })}
                        <SelectCategories id="categories-filters" class={classes.SelectCategories} label='Categories'
                            getDataArray={getCategories} suggestions={categories} placeholder={'Select Categories'}
                            exist={filteredCategories} />
                    </React.Fragment>
                }
            </FormControl>
            <Divider variant='fullWidth' className={classes.Devider} />
        </React.Fragment>
    )
}
export default FanficsFilters;