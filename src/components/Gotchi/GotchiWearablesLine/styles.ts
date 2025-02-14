import { alpha } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

export const styles = makeStyles((theme) =>
  createStyles({
    gotchiWLineWrapper: {
      display: 'flex',
      alignItems: 'center',
      margin: '8px 0 4px',
      position: 'relative',
      '&:hover > div:not(:hover)': {
        opacity: 0.25
      }
    },
    gotchiWLineItem: {
      cursor: 'pointer',
      flexGrow: 1,
      flexBasis: 0,
      maxWidth: '100%',
      backgroundColor: alpha(theme.palette.common.white, 0.2),
      height: 9,
      position: 'relative',
      margin: '0 0.5px',
      transition: 'all .2s ease-in-out'
    },
    gotchiWTooltipTitle: {
      width: 150,
      height: 150,
      margin: '-4px -8px'
    },
    gotchiWTooltipName: {
      color: theme.palette.primary.main,
      marginRight: 4
    },
    gotchiLvl: {
      display: 'inline-flex',
      position: 'relative',
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      borderRadius: '50%'
    },
    gotchiSetName: {
      position: 'absolute',
      bottom: 10,
      right: 0,
      left: 0,
      pointerEvents: 'none',
      color: '#F7EC13',
      textTransform: 'uppercase',
      fontSize: 12
    },
    cardName: {
      '.tooltip-wearable &': {
        fontSize: 12
      }
    },
    cardStats: {
      '.tooltip-wearable &': {
        fontSize: 14
      }
    },
    cardImage: {
      '.tooltip-wearable &': {
        paddingBottom: '35%'
      }
    },
    cardFoter: {
      '.tooltip-wearable &': {
        marginTop: 0
      }
    }
  })
);
