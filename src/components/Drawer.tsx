'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Drawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const drawerVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { x: '-100%', opacity: 0 }
  };

  const linkVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.1 * i,
        duration: 0.3
      }
    })
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <motion.button 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HamburgerMenuIcon className="w-6 h-6 text-gray-700" />
        </motion.button>
      </Dialog.Trigger>

      {isMounted && (
        <Dialog.Portal forceMount>
          <AnimatePresence>
            {isOpen && (
              <>
                <Dialog.Overlay asChild>
                  <motion.div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={overlayVariants}
                    transition={{ duration: 0.2 }}
                  />
                </Dialog.Overlay>

                <Dialog.Content asChild>
                  <motion.div
                    className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-white to-gray-50 shadow-2xl p-6 flex flex-col z-50"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={drawerVariants}
                  >
                    <div className="flex justify-between items-center mb-8">
                      <Dialog.Title className="text-xl font-bold text-gray-800">
                        Navegação
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <motion.button
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          whileHover={{ rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Cross1Icon className="w-5 h-5 text-gray-600" />
                        </motion.button>
                      </Dialog.Close>
                    </div>

                    <nav className="flex flex-col space-y-3">
                      {[
                        { href: "/", label: "📘 Cadastro de Livro" },
                        { href: "/livros", label: "📚 Lista de Livros" }
                      ].map((item, i) => (
                        <motion.div
                          key={item.href}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          variants={linkVariants}
                        >
                          <Link
                            href={item.href}
                            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-gray-200">
                      <motion.div
                        className="text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        © {new Date().getFullYear()} Biblioteca Digital
                      </motion.div>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </>
            )}
          </AnimatePresence>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}