import { useState } from "react";
import styles from '../styles/PopoverMenu.module.css'
import { useLayer, Arrow } from "react-laag";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'


export default function PopoverMenu(props) {
  const [isOpen, setOpen] = useState(false);

  // helper function to close the menu
  function close() {
    setOpen(false);
  }

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    onOutsideClick: close, // close the menu when the user clicks outside
    onDisappear: close, // close the menu when the menu gets scrolled out of sight
    overflowContainer: false, // keep the menu positioned inside the container
    auto: true, // automatically find the best placement
    placement: "bottom-end", // we prefer to place the menu "top-end"
    triggerOffset: 12, // keep some distance to the trigger
    containerOffset: 16, // give the menu some room to breath relative to the container
    arrowOffset: 16 // let the arrow have some room to breath also
  });

  // Again, we're using framer-motion for the transition effect
  return (
    <>
      <button {...triggerProps} onClick={() => setOpen(!isOpen)} className={styles.btnToggle}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <motion.ul {...layerProps} className={styles.content}>
              {
                props.options.map(
                  option => <li onClick={option.onClick}>{option.value}</li>
                )
              }
              <Arrow {...arrowProps} />
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </>
  );
}