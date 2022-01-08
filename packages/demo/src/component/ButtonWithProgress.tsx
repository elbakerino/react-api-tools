import React from 'react'
import clsx from 'clsx'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import Button, { ButtonProps } from '@material-ui/core/Button'
import { PROGRESS, PROGRESS_DONE, PROGRESS_ERROR, PROGRESS_START } from '@ui-schema/ui-schema/UIApi'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            //margin: theme.spacing(1),
            marginLeft: 0,
            position: 'relative',
            display: 'inline-block',
        },
        buttonSuccess: {
            //backgroundColor: green[500],
            backgroundColor: theme.palette.type === 'dark' ? theme.palette.success.dark : theme.palette.success.light,
            '&:hover': {
                backgroundColor: theme.palette.type === 'dark' ? theme.palette.success.dark : theme.palette.success.light,
            },
        },
        buttonError: {
            backgroundColor: theme.palette.type === 'dark' ? theme.palette.error.dark : theme.palette.error.light,
            '&:hover': {
                backgroundColor: theme.palette.type === 'dark' ? theme.palette.error.dark : theme.palette.error.light,
            },
        },
        buttonProgress: {
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
    }),
)

export const ButtonWithProgress: React.ComponentType<{ progress: PROGRESS } & ButtonProps> = (
    {progress, style, ...props},
) => {
    const classes = useStyles()
    const timer = React.useRef<number>()
    const [success, setSuccess] = React.useState<number>(0)

    const isSuccess = progress === PROGRESS_DONE
    const isError = progress === PROGRESS_ERROR
    React.useEffect(() => {
        if(isSuccess) {
            setSuccess(1)
        } else if(isError) {
            setSuccess(-1)
        }
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => {
            setSuccess(0)
        }, 1800)
        return () => {
            window.clearTimeout(timer.current)
            setSuccess(0)
        }
    }, [isSuccess, isError, setSuccess, timer])

    return <div className={classes.wrapper} style={style}>
        <Button
            {...props}
            disabled={props.disabled || progress === PROGRESS_START}
            className={clsx({
                [classes.buttonSuccess]: success === 1,
                [classes.buttonError]: success === -1,
            })}
        />

        {progress === PROGRESS_START && <CircularProgress size={24} className={classes.buttonProgress}/>}
    </div>
}
