import React, { useMemo } from 'react';
import { Modal } from '@douyinfe/semi-ui';
import type { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal/Modal';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconHelpCircle,
  IconInfoCircle,
  IconTickCircle,
} from '@douyinfe/semi-icons';
import classNames from 'classnames';

export interface CallModalProps extends ModalReactProps {
  // 对话框类型
  type?: 'success' | 'info' | 'warning' | 'error' | 'confirm';
}
/**
 * 还原 Modal.info / success / error / warning / confirm的样式, CallModal被作为一个组件调用的时候, 能够达到相同的UI效果
 */
export function CallModal(props: CallModalProps) {
  // modal的icon
  const modalIcon = useMemo<React.ReactNode>(() => {
    let _className = 'semi-modal-confirm-icon ';
    switch (props.type) {
      case 'info':
        _className += 'semi-modal-info-icon';
        return <IconInfoCircle className={_className} size={'extra-large'} />;
      case 'success':
        _className += 'semi-modal-success-icon';
        return <IconTickCircle className={_className} size={'extra-large'} />;
      case 'warning':
        _className += 'semi-modal-warning-icon';
        return <IconAlertTriangle className={_className} size={'extra-large'} />;
      case 'error':
        _className += 'semi-modal-error-icon';
        return <IconAlertCircle className={_className} size={'extra-large'} />;
      case 'confirm':
        _className += 'semi-modal-info-icon';
        return <IconHelpCircle className={_className} size={'extra-large'} />;
      default:
        return props.icon;
    }
  }, [props.type, props.icon]);
  // modal的className
  const className = useMemo(
      () => classNames(props.className, props.type ? 'semi-modal-confirm' : ''),
      [Boolean(props.type)],
  );
  // modal的title
  const title = props.type ? (
      <span className="semi-modal-confirm-title-text">{props.title}</span>
  ) : (
      props.title
  );
  // modal的children
  const children = props.type ? (
      <div
          className="semi-modal-confirm-content semi-modal-confirm-content-withIcon"
          x-semi-prop="content">
        {props.children || props.content}
      </div>
  ) : (
      props.children || props.content
  );
  return (
      <Modal
          {...props}
          title={title}
          icon={modalIcon}
          className={className}>
        {children}
      </Modal>
  );
}
const fontSize19: React.CSSProperties = { fontSize: 19 };
const fontSize22: React.CSSProperties = { fontSize: 22 };
