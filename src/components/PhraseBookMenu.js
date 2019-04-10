import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Accessibility from '@material-ui/icons/Accessibility';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Hotel from '@material-ui/icons/Hotel';
import DirectionsBus from '@material-ui/icons/DirectionsBus';
import People from '@material-ui/icons/People';
import BeachAccess from '@material-ui/icons/BeachAccess';
import LocalHospital from '@material-ui/icons/LocalHospital';

import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

import { getCategories } from '../services/dbAccess';

class PhraseBookMenu extends React.Component {
    state = {
        categories: [],
        categoriesOpen: [],
    }

    async componentDidMount() {
        const categories = await getCategories();
      
        if (categories != null) {
          const catExpanded = [];
          categories.forEach((category) => {
            catExpanded[category.id] = false
          });

          this.setState({
            categories,
            categoriesOpen: catExpanded,
          });
          
        }
    }

    toggleExpand = (categoryId) =>  {
        var categoriesOpen = {...this.state.categoriesOpen};
        categoriesOpen[categoryId] = !categoriesOpen[categoryId];
        this.setState({ categoriesOpen });
    }

    getIcon = categoryName => {
        switch(categoryName) {
            case 'Basics':
            case 'พื้นฐาน': 
                return <Accessibility />
            case 'Grammar':
            case 'ไวยากรณ์':
                return <LocalLibrary />
            case 'Shopping':
            case 'ช้อปปิ้ง':
                return <ShoppingCart />
            case 'Food & Accommodation':
            case 'อาหารและที่พัก':
                return <Hotel />
            case 'Getting Around':
            case 'ขนส่ง':
                return <DirectionsBus />
            case 'People & Communication' :
            case 'คนและการสื่อสาร':
                return <People />
            case 'Culture & Leisure':
            case 'วัฒนธรรมและเวลาว่าง':
                return <BeachAccess />
            case 'Other':
            case 'อื่น ๆ':
                return <LocalHospital />
            default:
                return null;
        }
    }

    render() {
        const { categories, categoriesOpen } = this.state;
        const { classes, match } = this.props;

        return (
            <List className={classes.list}>
                {categories.map(category => (
                    <div key={category.id}>
                        <ListItem className={classes.listMenuItem}  onClick={() => this.toggleExpand(category.id)}>
                            <ListItemIcon>
                                {this.getIcon(category.c_name)}
                            </ListItemIcon>
                            <ListItemText primary={category.c_name} />
                            {categoriesOpen[category.id] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        
                        <Collapse in={categoriesOpen[category.id]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding >
                            {category.subCategories.map(subcategory => (
                                <ListItem button key={subcategory.id} className={classes.subCategoryListItem}>
                                    <Link className={classes.listLink} to={match.url + subcategory.id} key={subcategory.id} >
                                        <ListItemText inset primary={subcategory.c_name} />
                                    </Link>
                                </ListItem>
                            ))}
                            </List>
                        </Collapse>
                        <Divider/>
                    </div>
                ))}
            </List>
        );
    }

}

export default withStyles(styles)(PhraseBookMenu);