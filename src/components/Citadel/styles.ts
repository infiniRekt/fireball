import { alpha } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

const keyframes = {
  drop: {
    '100%': {
      top: '100%'
    }
  }
};

const styles = makeStyles(() =>
  createStyles({
    citadelWrapper: {
      height: '100%',
      position: 'relative'
    },
    citadel: {
      position: 'absolute',
      '& canvas': {
        display: 'block'
      }
    }
  })
);

const InterfaceStyles = makeStyles((theme) =>
  createStyles({
    citadelInterface: {
      position: 'absolute',
      right: theme.spacing(2),
      top: theme.spacing(11),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      width: 1
    },
    citadelInterfaceButton: {
      margin: theme.spacing(0.2, 0),
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.3)
      },
      '&.active': {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.secondary.main, 0.7)
      }
    },
    citadelFullscreen: {
      position: 'absolute',
      right: theme.spacing(1),
      bottom: theme.spacing(0.8)
    },
    citadelSearch: {
      display: 'flex',
      alignItems: 'center'
    },
    citadelSearchField: {
      width: 150,
      '& .MuiInput-input': {
        textAlign: 'right',
        fontSize: 12
      }
    },
    interfaceDivider: {
      width: 40,
      backgroundColor: alpha('#fff', 0.3)
    }
  })
);

const LoaderStyles = makeStyles(() =>
  createStyles({
    citadelLoading: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'space-around',
      background: '#110121',
      transition: '.2s linear',
      zIndex: 1,
      '&.is-loaded': {
        opacity: 0,
        visibility: 'hidden'
      }
    },
    citadelLoadingLine: {
      width: 1,
      position: 'relative',
      overflow: 'hidden',
      '&:after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        height: '15%',
        width: '100%',
        top: '-50%',
        left: 0,
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #fff 75%, #bef3f5 100%)',
        animation: '7s cubic-bezier(0.4, 0.26, 0, 0.97) 0s infinite $drop',
        willChange: 'top'
      },
      '&:nth-of-type(1)': {
        '&:after': {
          animationDelay: '2.5s'
        }
      },
      '&:nth-of-type(3)': {
        '&:after': {
          animationDelay: '2s'
        }
      }
    },
    citadelLoadingInner: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 134,
      height: 124
    },
    citadelLoadingIcon: {
      width: '100%',
      height: '100%'
    },
    '@keyframes drop': keyframes.drop
  })
);

const InfoStyles = makeStyles((theme) =>
  createStyles({
    infoContainer: {
      position: 'absolute',
      left: theme.spacing(1),
      bottom: 0
    },
    infoItem: {
      fontSize: 11,
      margin: theme.spacing(0.5, 0),
      opacity: 0.8
    },
    infoButton: {
      padding: 4,
      borderRadius: 4,
      display: 'inline-block',
      backgroundColor: theme.palette.background.default
    }
  })
);

const FilterStyles = makeStyles((theme) =>
  createStyles({
    dropdownContainer: {
      position: 'absolute',
      left: theme.spacing(2),
      top: theme.spacing(8),
      display: 'flex',
      alignItems: 'center',

      '&.opened': {
        zIndex: theme.zIndex.appBar + 11
      }
    },
    filterButton: {
      lineHeight: 1,
      padding: '9px 16px',
      background: alpha('#fff', 0.3),
      color: '#fff',
      '&:hover': {
        background: alpha('#fff', 0.4)
      },
      '&.active': {
        background: alpha(theme.palette.primary.main, 0.8),
        color: '#000',
        borderRadius: '4px 4px 0 0'
      }
    },
    filtersCount: {
      position: 'absolute',
      top: -2,
      right: -4,
      width: 14,
      height: 14,
      fontSize: 10,
      fontWeight: 700,
      borderRadius: 2,
      lineHeight: 1,
      color: '#000',
      background: theme.palette.primary.main,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    filtersDropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      width: 320,
      background: theme.palette.background.paper,
      borderRadius: '0 4px 4px 4px',
      cursor: 'default',
      overflow: 'hidden',
      display: 'none',
      '.opened &': {
        display: 'block'
      }
    },
    filterBackdrop: {
      zIndex: theme.zIndex.drawer + 1
    },
    buttonsWrapper: {
      padding: 12,
      display: 'flex',
      justifyContent: 'space-between'
    },
    results: {
      marginLeft: 'auto',
      paddingRight: 8,
      fontWeight: 'bold'
    },
    placeholder: {
      marginLeft: 4,
      '& img': {
        display: 'block'
      }
    }
  })
);

export { styles, LoaderStyles, InterfaceStyles, InfoStyles, FilterStyles };
