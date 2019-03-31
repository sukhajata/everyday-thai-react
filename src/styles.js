import theme from './theme';
import { fade } from '@material-ui/core/styles/colorManipulator';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

export default {
    root: {
      width: '100%',
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    navigation: {
      width: '100%',
      background: green[500],
      color: '#fff',
    },
    choiceButton1: {
      width: '100%',
      marginBottom: 10,
      textTransform: 'none',
      background: theme.palette.secondary.main,
    },
    choiceButton2: {
      width: '100%',
      marginBottom: 10,
      textTransform: 'none',
      background: theme.palette.primary.main,
      color: '#FFF',
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit,
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
    content: {
      marginTop: 70,
      
    },
    lessonContent: {
      margin: 12,
    },
    loading: {
      padding: 15,
    },
    noResults: {
      padding: 30,
    },
    pos: {
      marginBottom: 12,
    },
    full: {
      flex: 1,
    },
    gridItem90: {
      width: '90%',
    },
    upper: {
      background: theme.palette.secondary.dark,
      color: theme.palette.primary.contrastText,
    },
    second: {
      background: theme.palette.secondary.light,
    },
    white: {
      background: theme.palette.primary.contrastText,
    },
    header: {
      paddingTop: 30,
      paddingBottom: 30,
      paddingRight: 40,
      paddingLeft: 20,
    },
    headerText: {
      paddingTop: 0,
      paddingLeft: 12,
    },
    list: {
      background: theme.palette.primary.contrastText,
    },
    listMenuItem: {
      padding: 20 ,
    },
    subCategoryListItem: {
      background: theme.palette.secondary.light,
      marginBottom: 2,
    },
    listLink: {
      textDecoration: 'none',
    },
    defaultCard: {
      background: "#FFFFFF",
      width: '100%',
      marginBottom: 8,
      transition: '1s'
    },
    correctCard: {
      background: green[500],
      width: '100%',
      marginBottom: 8,
    },
    correctCardFade: {
      background: green[500],
      width: '100%',
      marginBottom: 8,
      transition: '0.5s',
      visibility: 'hidden',
    },
    wrongCard: {
      background: red[500],
      width: '100%',
      marginBottom: 8,
    },
    upperChip: {
      marginBottom: 5,
      marginRight: 4,
    },
    defaultChip: {
      background: theme.palette.secondary.main,
      padding: 5,
      marginBottom: 5,
      marginRight: 4,
      transition: '1s'
    },
    disabledChip: {
      background: theme.palette.secondary.light,
      padding: 5,
      marginBottom: 5,
      marginRight: 4,
      transition: '1s'
    },
    hiddenChip: {
      visibility: 'hidden',
      marginBottom: 5,
      marginRight: 4,
    },
    correctChip: {
      background: green[500],
      padding: 5,
      marginBottom: 5,
      marginRight: 4,
    },
    correctChipFade: {
      background: green[500],
      padding: 5,
      marginBottom: 5,
      marginRight: 5,
      transition: '0.2s',
      visibility: 'hidden',
    },
    wrongChip: {
      background: red[500],
      padding: 5,
      marginBottom: 5,
      marginRight: 4,
    },
    totals: {
      padding: 30,
      backgroundColor: theme.palette.secondary.main,
      fontSize: 22,
      marginTop: 20,
      marginBottom: 20,
    },
    topMargin: {
      marginTop: 0,
    },
    notes: {
      background: theme.palette.secondary.light,
      paddingBottom: 5,
      paddingTop: 5,
      paddingLeft: 5,
      paddingRight: 5
    },
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    titleCard: {
      margin: 10,
    },
    imageHolder: {
      padding: 7,
    },
    imageHolderWrong: {
      padding: 7,
      backgroundColor: red[500],
    },
    imageHolderCorrect: {
      padding: 7,
      backgroundColor: green[500],
    },
    imageFit: {
      width: '100%',
      maxWidth: 500,
    },
    imageBlur: {
      width: '100%',
      maxWidth: 500,
      opacity: 0.3,
    },
    middle: {
      transition: '.5s ease',
      opacity: 1,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
    },
    imageTable: {
      width: 'auto',
    },
    matching: {
      width: 400,
      textAlign: 'center',
    },
    alt: {
      background: theme.palette.secondary.main,
    },
    highlightCorrect: {
        background: green[500],
    },
    highlightWrong: {
        background: red[500],
    },
    playIcon: {
      width: 30,
      height: 30,
      marginTop: 5,
      color: green[500],
    },
    correctIcon: {
      width: 50,
      height: 50,
      marginTop: 5,
      color: green[500],
    },
    wrongIcon: {
      width: 50,
      height: 50,
      marginTop: 5,
      color: red[500],
    },
    playingIcon: {
      width: 30,
      height: 30,
      marginTop: 5,
      color: red[500],
    },
    favourite: {
      width: 25,
      height: 25,
      marginTop: 6,
      color: red[500],
    },
    unFavourite: {
      width: 25,
      height: 25,
      marginTop: 6,
      color: theme.palette.secondary.light,
    },
    table: {
      display: 'table',
      borderCollapse: 'collapse',
      width: '100%',
      tableLayout: 'fixed',
      marginBottom: 0,
      paddingBottom: 0,
    },
    tableCell: {
      display: 'table-cell',
      border: 0,
    },
    tableCellImg: {
      width: '100%',
    },
    visible: {
      visibility: 'visible',
    },
    hidden: {
      visibility: 'collapse',
    }
  };